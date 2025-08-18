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

		// Check what fields we received
		console.log('Received fields:', fields);
		console.log('Received files:', Object.keys(files));

		// Normalize: Formidable may return an array for the same field
		// Try both 'file' and 'audio' field names (prioritize 'file')
		let audioField = files.file || files.audio;
		const audioFile = Array.isArray(audioField) ? audioField[0] : audioField;

		if (!audioFile) {
			return res.status(400).json({ 
				error: 'No audio file provided. Expected field name: "file"',
				receivedFields: Object.keys(files)
			});
		}

		console.log('Processing file:', {
			filename: audioFile.originalFilename,
			mimetype: audioFile.mimetype,
			size: audioFile.size
		});

		// Validate file type using improved validation that handles undefined MIME types
		if (!isSupportedFormat(audioFile.mimetype, audioFile.originalFilename)) {
			return res.status(400).json({
				error: `Invalid file type: ${audioFile.mimetype || 'unknown'}. File: ${audioFile.originalFilename}. Supported formats include MP3, MP4, WAV, OGG, FLAC, AVI, MOV and many more.`,
			});
		}

		// Read the file
		const audioBuffer = fs.readFileSync(audioFile.filepath);

		// Determine a safe MIME type for OpenAI if missing
		const fallbackMime = getMimeTypeFromExtension(audioFile.originalFilename) || 'audio/mp4';
		const mimeForUpload = audioFile.mimetype || fallbackMime;

		console.log('Uploading to OpenAI with MIME type:', mimeForUpload);

		// Create a proper File object for OpenAI API
		const fileForOpenAI = new File([audioBuffer], audioFile.originalFilename, {
			type: mimeForUpload
		});

		// Transcribe using OpenAI Whisper
		const transcription = await openai.audio.transcriptions.create({
			file: fileForOpenAI,
			model: 'whisper-1',
			response_format: 'verbose_json',
			timestamp_granularities: ['word'],
		});

		// Clean up the temporary file
		fs.unlinkSync(audioFile.filepath);

		console.log('Transcription successful:', {
			language: transcription.language,
			duration: transcription.duration,
			wordCount: transcription.text.split(' ').length
		});

		// Return the transcription result
		res.status(200).json({
			success: true,
			transcription: transcription.text,
			segments: transcription.segments,
			language: transcription.language,
			duration: transcription.duration,
		});
	} catch (error) {
		console.error('Transcription error:', error);

		// Clean up any temporary files if they exist
		try {
			const audioField = parsedFiles?.file || parsedFiles?.audio;
			const maybeFile = Array.isArray(audioField) ? audioField[0] : audioField;
			if (maybeFile?.filepath && fs.existsSync(maybeFile.filepath)) {
				fs.unlinkSync(maybeFile.filepath);
			}
		} catch {}

		res.status(500).json({
			error: 'Transcription failed',
			details: error.message,
		});
	}
}
