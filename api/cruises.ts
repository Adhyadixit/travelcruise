import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

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
        // Fetch a specific cruise by ID
        const cruiseResult = await pool.query('SELECT * FROM cruises WHERE id = $1', [id]);
        
        if (cruiseResult.rows.length > 0) {
          const cruise = cruiseResult.rows[0];
          
          // Fetch cabin types for this cruise
          const cabinTypesResult = await pool.query('SELECT * FROM cabin_types WHERE cruise_id = $1', [id]);
          
          // Return cruise with cabin types
          const cruiseWithCabinTypes = {
            ...cruise,
            cabinTypes: cabinTypesResult.rows
          };
          
          res.status(200).json(cruiseWithCabinTypes);
        } else {
          res.status(404).json({ error: 'Cruise not found' });
        }
      } else {
        // Fetch all cruises
        const result = await pool.query('SELECT * FROM cruises ORDER BY id');
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
