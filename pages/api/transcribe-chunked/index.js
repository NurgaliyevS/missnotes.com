import formidable from 'formidable';
import fs from 'fs';
import OpenAI from 'openai';
import { MAX_FILE_SIZE, isSupportedFormat, getMimeTypeFromExtension } from '@/lib/audioFormats';

// Vercel has a 4.5MB payload limit, so we set chunk limit to 4MB to be safe
const CHUNK_MAX_SIZE = 4 * 1024 * 1024; // 4MB limit for individual chunks

// Disable default body parser for file uploads
export const config = {
	api: {
		bodyParser: false,
	},
};

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	let parsedFiles;

	try {
		// Parse the form data with chunk-appropriate size limit
		const form = formidable({
			maxFileSize: CHUNK_MAX_SIZE,
			keepExtensions: true,
		});

		const [fields, files] = await new Promise((resolve, reject) => {
			form.parse(req, (err, fields, files) => {
				if (err) reject(err);
				resolve([fields, files]);
			});
		});

		parsedFiles = files;

		console.log('Chunked transcription - Received fields:', fields);
		console.log('Chunked transcription - Received files:', Object.keys(files));

		// Extract chunk metadata from form fields
		const chunkIndex = parseInt(fields.chunkIndex?.[0] || fields.chunkIndex || '0');
		const totalChunks = parseInt(fields.totalChunks?.[0] || fields.totalChunks || '1');
		const sessionId = fields.sessionId?.[0] || fields.sessionId || null;
		const originalFilename = fields.originalFilename?.[0] || fields.originalFilename || null;

		// Validate chunk metadata
		if (chunkIndex < 0 || chunkIndex >= totalChunks) {
			return res.status(400).json({
				error: 'Invalid chunk metadata',
				details: `chunkIndex (${chunkIndex}) must be between 0 and totalChunks-1 (${totalChunks - 1})`
			});
		}

		if (totalChunks < 1 || totalChunks > 200) {
			return res.status(400).json({
				error: 'Invalid total chunks',
				details: 'totalChunks must be between 1 and 200 (increased to accommodate smaller chunks)'
			});
		}

		console.log('Chunk metadata:', {
			chunkIndex,
			totalChunks,
			sessionId,
			originalFilename
		});

		// Get the audio file (same logic as original endpoint)
		let audioField = files.file || files.audio;
		const audioFile = Array.isArray(audioField) ? audioField[0] : audioField;

		if (!audioFile) {
			return res.status(400).json({ 
				error: 'No audio file provided. Expected field name: "file"',
				receivedFields: Object.keys(files)
			});
		}

		// Check if this is a processed file
		const isProcessedFile = audioFile.originalFilename?.includes('processed') || 
		                        audioFile.mimetype === 'audio/mpeg' ||
		                        audioFile.originalFilename?.endsWith('.mp3');

		console.log('Processing chunk:', {
			filename: audioFile.originalFilename,
			mimetype: audioFile.mimetype,
			size: audioFile.size,
			chunkIndex,
			totalChunks,
			sessionId,
			isProcessedFile: isProcessedFile
		});

		// Validate chunk size for Vercel compatibility
		if (audioFile.size > CHUNK_MAX_SIZE) {
			return res.status(413).json({
				error: 'Chunk too large for Vercel',
				details: `Chunk size ${audioFile.size} bytes exceeds Vercel's 4.5MB limit. Maximum allowed: ${CHUNK_MAX_SIZE} bytes`,
				chunkIndex,
				totalChunks
			});
		}

		// Validate file type - allow MP3 for processed files
		if (!isSupportedFormat(audioFile.mimetype, audioFile.originalFilename) && !isProcessedFile) {
			return res.status(400).json({
				error: `Invalid file type: ${audioFile.mimetype || 'unknown'}. File: ${audioFile.originalFilename}. Supported formats include MP3, M4A, WAV, OGG, FLAC, AAC, AIFF and many more audio formats.`,
			});
		}

		// Read the chunk file
		const audioBuffer = fs.readFileSync(audioFile.filepath);

		// Determine a safe MIME type for OpenAI if missing
		// For processed files, use audio/mpeg, otherwise use original logic
		const fallbackMime = isProcessedFile ? 'audio/mpeg' : 
		                     (getMimeTypeFromExtension(audioFile.originalFilename) || 'audio/mpeg');
		const mimeForUpload = audioFile.mimetype || fallbackMime;

		console.log('Uploading chunk to OpenAI with MIME type:', mimeForUpload);

		// Create a proper File object for OpenAI API
		const fileForOpenAI = new File([audioBuffer], audioFile.originalFilename, {
			type: mimeForUpload
		});

		// Transcribe the chunk using OpenAI Whisper with optimized settings
		const transcription = await openai.audio.transcriptions.create({
			file: fileForOpenAI,
			model: 'whisper-1',
			response_format: 'verbose_json', // Need verbose_json to get duration
			// Add minimal prompt for better context
			prompt: chunkIndex === 0 ? "Meeting recording" : "Meeting continuation",
			// Optimize for speed
			temperature: 0.0, // More consistent results for chunks
			// Remove language parameter to let Whisper auto-detect
		});

		// Clean up the temporary file
		fs.unlinkSync(audioFile.filepath);

		// Calculate chunk statistics
		const wordCount = transcription.text.split(' ').length;
		const avgWordsPerSecond = transcription.duration ? wordCount / transcription.duration : 0;

		console.log('Chunk transcription successful (optimized):', {
			language: transcription.language,
			duration: transcription.duration,
			wordCount,
			avgWordsPerSecond: avgWordsPerSecond.toFixed(2),
			chunkIndex,
			totalChunks,
			segmentCount: transcription.segments?.length || 0,
			optimized: true
		});

		// Return the chunk transcription result with enhanced metadata
		res.status(200).json({
			success: true,
			transcription: transcription.text,
			segments: transcription.segments,
			language: transcription.language,
			duration: transcription.duration,
			chunkIndex,
			totalChunks,
			sessionId,
			originalFilename,
			timestamp: new Date().toISOString(),
			// Additional chunk statistics
			wordCount,
			avgWordsPerSecond: parseFloat(avgWordsPerSecond.toFixed(2)),
			segmentCount: transcription.segments?.length || 0,
			// Chunk processing info
			chunkSize: audioFile.size,
			isFirstChunk: chunkIndex === 0,
			isLastChunk: chunkIndex === totalChunks - 1
		});

	} catch (error) {
		console.error('Chunk transcription error:', error);

		// Clean up any temporary files if they exist
		try {
			const audioField = parsedFiles?.file || parsedFiles?.audio;
			const maybeFile = Array.isArray(audioField) ? audioField[0] : audioField;
			if (maybeFile?.filepath && fs.existsSync(maybeFile.filepath)) {
				fs.unlinkSync(maybeFile.filepath);
			}
		} catch {}

		res.status(500).json({
			error: 'Chunk transcription failed',
			details: error.message,
		});
	}
}
