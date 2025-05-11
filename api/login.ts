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

  // Handle POST request for login
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;

      // Find user with matching username and password
      // In a production app, you would compare hashed passwords
      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1 AND password = $2',
        [username, password]
      );

      if (result.rows.length > 0) {
        const user = result.rows[0];
        
        // In a real app, you would use a proper JWT library
        const token = "jwt-" + Date.now();
        
        // Don't send password to client
        const { password, ...userWithoutPassword } = user;
        
        res.status(200).json({
          user: userWithoutPassword,
          token
        });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
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
