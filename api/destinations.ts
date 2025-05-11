import type { VercelRequest, VercelResponse } from '@vercel/node';

// Sample destinations data
const destinations = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFyaXN8ZW58MHx8MHx8fDA%3D",
    description: "The City of Light, famous for its stunning architecture, art museums, and romantic atmosphere.",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Bali",
    country: "Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFsaXxlbnwwfHwwfHx8MA%3D%3D",
    description: "A tropical paradise known for its beautiful beaches, vibrant culture, and lush landscapes.",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Tokyo",
    country: "Japan",
    imageUrl: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dG9reW98ZW58MHx8MHx8fDA%3D",
    description: "A bustling metropolis that perfectly blends ultramodern and traditional, from neon-lit skyscrapers to historic temples.",
    featured: false,
    createdAt: new Date().toISOString()
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request
  if (req.method === 'GET') {
    res.status(200).json(destinations);
    return;
  }

  // Handle unsupported methods
  res.status(405).json({ error: 'Method not allowed' });
}
