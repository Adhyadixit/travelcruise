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

  // Handle GET request
  if (req.method === 'GET') {
    try {
      const { id, destinationId } = req.query;
      
      if (id) {
        // Fetch a specific event by ID
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        
        if (result.rows.length > 0) {
          res.status(200).json(result.rows[0]);
        } else {
          res.status(404).json({ error: 'Event not found' });
        }
      } else if (destinationId) {
        // Return events for a specific destination
        const result = await pool.query('SELECT * FROM events WHERE destination_id = $1 ORDER BY start_date', [destinationId]);
        res.status(200).json(result.rows);
      } else {
        // Return all events
        const result = await pool.query('SELECT * FROM events ORDER BY start_date');
        res.status(200).json(result.rows);
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
