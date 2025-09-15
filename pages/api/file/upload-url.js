import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { filename, mimetype } = req.body;

    if (!filename || !mimetype) {
      return res.status(400).json({ error: "Missing filename or mimetype" });
    }

    const uniqueId = crypto.randomBytes(8).toString("hex");
    const key = `${uniqueId}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: 'missnotes',
      Key: key,
      ContentType: mimetype,
      ACL: "public-read", // optional, depending on your setup
    });

    
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 min expiry

    const fileUrl = `${process.env.R2_ENDPOINT}/${key}`;

    return res.status(200).json({
      uploadUrl,
      fileUrl,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return res.status(500).json({ error: "Failed to generate upload URL" });
  }
}
