import formidable from 'formidable';
import fs from 'fs';
import OpenAI from 'openai';
import { MAX_FILE_SIZE, isSupportedFormat, getMimeTypeFromExtension } from '@/lib/audioFormats';

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
		// Parse the form data
		const form = formidable({
			maxFileSize: MAX_FILE_SIZE,
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

		if (totalChunks < 1 || totalChunks > 100) {
			return res.status(400).json({
				error: 'Invalid total chunks',
				details: 'totalChunks must be between 1 and 100'
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

		console.log('Processing chunk:', {
			filename: audioFile.originalFilename,
			mimetype: audioFile.mimetype,
			size: audioFile.size,
			chunkIndex,
			totalChunks,
			sessionId
		});

		// Validate file type
		if (!isSupportedFormat(audioFile.mimetype, audioFile.originalFilename)) {
			return res.status(400).json({
				error: `Invalid file type: ${audioFile.mimetype || 'unknown'}. File: ${audioFile.originalFilename}. Supported formats include MP3, M4A, WAV, OGG, FLAC, AAC, AIFF and many more audio formats.`,
			});
		}

		// Read the chunk file
		const audioBuffer = fs.readFileSync(audioFile.filepath);

		// Determine a safe MIME type for OpenAI if missing
		const fallbackMime = getMimeTypeFromExtension(audioFile.originalFilename) || 'audio/mp4';
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
			response_format: 'json', // Simplified format for faster processing
			// Remove word-level timestamps for faster processing and lower cost
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
