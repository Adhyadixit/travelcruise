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
      const { id } = req.query;
      
      if (id) {
        // Fetch a specific hotel by ID
        const hotelResult = await pool.query('SELECT * FROM hotels WHERE id = $1', [id]);
        
        if (hotelResult.rows.length > 0) {
          const hotel = hotelResult.rows[0];
          
          // Fetch room types for this hotel
          const roomTypesResult = await pool.query('SELECT * FROM room_types WHERE hotel_id = $1', [id]);
          
          // Return hotel with room types
          const hotelWithRoomTypes = {
            ...hotel,
            roomTypes: roomTypesResult.rows
          };
          
          res.status(200).json(hotelWithRoomTypes);
        } else {
          res.status(404).json({ error: 'Hotel not found' });
        }
      } else {
        // Fetch all hotels
        const result = await pool.query('SELECT * FROM hotels ORDER BY id');
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
