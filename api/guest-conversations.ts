import type { VercelRequest, VercelResponse } from '@vercel/node';
// Use require for pg to avoid ESM issues on Vercel
const pg = require('pg');
const { Pool } = pg;

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    try {
      // If guestUserId is provided, return conversations for that user
      if (guestUserId) {
        // Get all conversations for this guest user
        const conversationsResult = await pool.query(
          'SELECT * FROM conversations WHERE guest_user_id = $1 ORDER BY updated_at DESC',
          [guestUserId]
        );
        
        // For each conversation, get its messages
        const conversationsWithMessages = await Promise.all(
          conversationsResult.rows.map(async (conversation) => {
            const messagesResult = await pool.query(
              'SELECT * FROM conversation_messages WHERE conversation_id = $1 ORDER BY created_at ASC',
              [conversation.id]
            );
            
            return {
              ...conversation,
              messages: messagesResult.rows
            };
          })
        );
        
        res.status(200).json(conversationsWithMessages);
      } else {
        res.status(200).json([]);
      }
    } catch (error: any) {
      console.error('Database error:', error);
      res.status(500).json({ error: error.message });
    }
    return;
  }

  // Handle unsupported methods
  res.status(405).json({ error: 'Method not allowed' });
}
