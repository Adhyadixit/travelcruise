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
      const { id, userId } = req.query;
      
      if (id) {
        // Fetch a specific booking by ID
        const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
        
        if (result.rows.length > 0) {
          res.status(200).json(result.rows[0]);
        } else {
          res.status(404).json({ error: 'Booking not found' });
        }
      } else if (userId) {
        // Return bookings for a specific user
        const result = await pool.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.status(200).json(result.rows);
      } else {
        // Return all bookings
        const result = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
        res.status(200).json(result.rows);
      }
    } catch (error: any) {
      console.error('Database error:', error);
      res.status(500).json({ error: error.message });
    }
    return;
  }

  // Handle POST request for creating a new booking
  if (req.method === 'POST') {
    try {
      const {
        user_id,
        booking_type,
        item_id,
        start_date,
        end_date,
        adults,
        children,
        total_price,
        special_requests
      } = req.body;
      
      // Validate required fields
      if (!user_id || !booking_type || !item_id || !start_date || !end_date || !adults || !total_price) {
        return res.status(400).json({ error: 'Missing required booking information' });
      }
      
      // Insert new booking into database
      const result = await pool.query(
        `INSERT INTO bookings 
        (user_id, booking_type, item_id, start_date, end_date, adults, children, 
        status, payment_status, total_price, transaction_id, special_requests, created_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [
          user_id,
          booking_type,
          item_id,
          start_date,
          end_date,
          adults,
          children || 0,
          'confirmed',
          'paid',
          total_price,
          'TXN' + Date.now(),
          special_requests || '',
          new Date().toISOString()
        ]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Database error:', error);
      res.status(400).json({ error: error.message });
    }
    return;
  }

  // Handle unsupported methods
  res.status(405).json({ error: 'Method not allowed' });
}
