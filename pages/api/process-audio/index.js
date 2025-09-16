import ffmpeg from 'fluent-ffmpeg';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Configure FFmpeg path for Vercel
// Use system FFmpeg in production, ffmpeg-static in development
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

// Configure API to handle multipart form data
export const config = {
    api: {
        bodyParser: false, // Disable default body parser for multipart forms
    },
};

// Helper function to clean up temporary files
const cleanupTempFiles = async (filePaths) => {
    for (const filePath of filePaths) {
        try {
            if (fs.existsSync(filePath)) {
                await promisify(fs.unlink)(filePath);
                console.log(`Cleaned up temporary file: ${filePath}`);
            }
        } catch (error) {
            console.error(`Error cleaning up ${filePath}:`, error);
        }
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const tempFiles = []; // Track temporary files for cleanup

    try {
        // Parse multipart form data
        const form = formidable({
            maxFileSize: 50 * 1024 * 1024, // 50MB limit
            uploadDir: '/tmp', // Use /tmp for Vercel compatibility
            keepExtensions: true,
        });

        const [fields, files] = await form.parse(req);
        
        if (!files.file || !files.file[0]) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const uploadedFile = files.file[0];
        const originalFilename = uploadedFile.originalFilename || 'audio-file';
        const inputPath = uploadedFile.filepath;
        tempFiles.push(inputPath);

        console.log('Processing audio file:', {
            originalName: originalFilename,
            inputPath: inputPath,
            size: uploadedFile.size
        });

        // Generate unique output path for processed file (MP3 format)
        // Add random component to prevent conflicts when processing chunks in parallel
        const randomId = Math.random().toString(36).substr(2, 9);
        const outputFilename = `processed-${Date.now()}-${randomId}-${originalFilename.replace(/\.[^/.]+$/, '.mp3')}`;
        const outputPath = path.join('/tmp', outputFilename);
        tempFiles.push(outputPath);

        // Process audio with FFmpeg (speed up by 1.5x)
        // Vercel Pro plan allows 60 seconds, so we can process larger files
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('FFmpeg processing timeout - file too large (60s limit)'));
            }, 55000); // 55 second timeout for Vercel Pro (leaving 5s buffer)

                    ffmpeg(inputPath)
                        .audioFilters('atempo=1.5') // Speed up audio by 1.5x
                        .audioBitrate('64k') // Very low bitrate to stay under 4MB limit
                        .format('mp3') // Use MP3 format for better compression
                        .audioChannels(1) // Mono output to reduce size
                        .audioFrequency(16000) // Very low sample rate to reduce size
                .on('start', (commandLine) => {
                    console.log('FFmpeg command:', commandLine);
                })
                .on('progress', (progress) => {
                    // FFmpeg progress object structure varies, so we'll log what's available
                    if (progress.percent) {
                        console.log('Processing progress:', progress.percent + '%');
                    } else if (progress.timemark) {
                        console.log('Processing progress:', progress.timemark);
                    } else {
                        console.log('Processing progress:', 'processing...');
                    }
                })
                .on('end', () => {
                    clearTimeout(timeout);
                    console.log('Audio processing completed');
                    resolve();
                })
                .on('error', (error) => {
                    clearTimeout(timeout);
                    console.error('FFmpeg error:', error);
                    reject(error);
                })
                .save(outputPath);
        });

        // Read processed file
        const processedFileBuffer = await promisify(fs.readFile)(outputPath);
        console.log('Processed file read successfully:', {
            outputPath: outputPath,
            processedSize: processedFileBuffer.length,
            fileExists: fs.existsSync(outputPath)
        });

        // Clean up temporary files
        await cleanupTempFiles(tempFiles);

        // For Vercel compatibility, upload processed file to R2 and return URL
        // instead of base64 (which exceeds 4MB response limit)
        const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
        
        const s3Client = new S3Client({
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
            },
        });

                // Generate unique filename for processed file (MP3)
                const processedFilename = `processed-${Date.now()}-${originalFilename.replace(/\.[^/.]+$/, '.mp3')}`;
                
                // Upload processed file to R2
                const command = new PutObjectCommand({
                    Bucket: 'missnotes',
                    Key: processedFilename,
                    Body: processedFileBuffer,
                    ContentType: 'audio/mpeg',
                    ContentLength: processedFileBuffer.length,
                    ACL: 'public-read',
                });

        await s3Client.send(command);
        
        const fileUrl = `${process.env.R2_ENDPOINT}/${processedFilename}`;
        
        return res.status(200).json({ 
            message: 'Audio processed successfully', 
            processedFileUrl: fileUrl,
            originalSize: uploadedFile.size,
            processedSize: processedFileBuffer.length,
            compressionRatio: ((uploadedFile.size - processedFileBuffer.length) / uploadedFile.size * 100).toFixed(1) + '%',
            filename: originalFilename
        });
        
    } catch (error) {
        console.error('Error processing audio:', error);
        
        // Clean up temporary files on error
        await cleanupTempFiles(tempFiles);
        
        return res.status(500).json({ 
            error: 'Failed to process audio: ' + error.message 
        });
    }
}
