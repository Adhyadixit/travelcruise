import type { VercelRequest, VercelResponse } from '@vercel/node';

// Sample conversations data
const conversations = [
  {
    id: 1,
    subject: "Inquiry about Paris packages",
    status: "open",
    lastMessageAt: new Date().toISOString(),
    readByUser: true,
    readByAdmin: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 1,
        content: "Hello, I'm interested in booking a trip to Paris. Do you have any special packages?",
        senderType: "guest",
        createdAt: new Date().toISOString()
      }
    ]
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

  // Get the guestUserId from query parameters
  const { guestUserId } = req.query;

  // Handle GET request
  if (req.method === 'GET') {
    // If guestUserId is provided, return conversations for that user
    // Otherwise, return an empty array
    if (guestUserId) {
      // In a real app, you would filter conversations by guestUserId
      res.status(200).json(conversations);
    } else {
      res.status(200).json([]);
    }
    return;
  }

  // Handle unsupported methods
  res.status(405).json({ error: 'Method not allowed' });
}
