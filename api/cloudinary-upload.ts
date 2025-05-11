import { v2 as cloudinary } from 'cloudinary';
import type { VercelRequest, VercelResponse } from '@vercel/node';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Example: expects base64 image in req.body.image
    const { image } = req.body;
    if (!image) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }
    try {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      });
      res.status(200).json({ url: uploadResponse.secure_url });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to upload image' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
