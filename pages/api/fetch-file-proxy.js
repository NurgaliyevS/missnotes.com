import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Configure S3 client for Cloudflare R2
const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fileUrl } = req.body;

    if (!fileUrl) {
        return res.status(400).json({ error: 'File URL is required' });
    }

    try {
        // Extract the key from the full URL
        const url = new URL(fileUrl);
        // Remove leading slash and bucket name from path
        const pathParts = url.pathname.substring(1).split('/');
        const key = pathParts.slice(1).join('/'); // Remove bucket name, keep rest

        console.log('Fetching file from R2:', {
            fileUrl: fileUrl,
            pathname: url.pathname,
            pathParts: pathParts,
            key: key
        });

        // Get the file from R2
        const command = new GetObjectCommand({
            Bucket: 'missnotes',
            Key: key,
        });

        const response = await s3Client.send(command);
        
        // Set appropriate headers
        res.setHeader('Content-Type', response.ContentType || 'audio/mp4');
        res.setHeader('Content-Length', response.ContentLength || '0');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

        // Stream the file to the client
        response.Body.pipe(res);

    } catch (error) {
        console.error('Error fetching file:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch file: ' + error.message 
        });
    }
}
