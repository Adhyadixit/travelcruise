import { v2 as cloudinary } from 'cloudinary';
import type { VercelRequest, VercelResponse } from '@vercel/node';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Vercel serverless function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { file, folder } = req.body;
    if (!file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }
    if (!file.startsWith('data:image/')) {
      res.status(400).json({ error: 'Invalid file format. Only images are allowed.' });
      return;
    }
    const approximateSize = (file.length * 3) / 4 / 1024 / 1024;
    if (approximateSize > 7) {
      res.status(400).json({ error: 'File size too large. Maximum is 5MB.' });
      return;
    }
    const result = await cloudinary.uploader.upload(file, {
      folder: folder || 'travelease',
      resource_type: 'auto',
    });
    res.status(201).json({ url: result.secure_url, publicId: result.public_id });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
}
