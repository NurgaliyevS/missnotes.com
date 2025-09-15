import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb', // Increase the body size limit to 50MB
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { file, originalFilename, mimetype, size } = req.body;

        if (!file || !originalFilename) {
            return res.status(400).json({ error: 'Missing required file data' });
        }

        const fileBuffer = Buffer.from(file, 'base64');
        const uniqueId = crypto.randomBytes(8).toString("hex");
        
        const command = new PutObjectCommand({
            Bucket: 'missnotes',
            Key: `${uniqueId}-${originalFilename}`,
            Body: fileBuffer,
            ContentType: mimetype || 'application/octet-stream',
            ContentLength: fileBuffer.length,
            ACL: 'public-read',
        });

        await s3Client.send(command);
        
        const fileUrl = `${process.env.R2_ENDPOINT}/${uniqueId}-${originalFilename}`;
        
        return res.status(200).json({ 
            message: 'File uploaded successfully', 
            url: fileUrl 
        });
        
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ error: 'Failed to upload file: ' + error.message });
    }
}