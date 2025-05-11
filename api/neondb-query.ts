import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Example: simple query
    const result = await pool.query('SELECT NOW() as now');
    res.status(200).json({ time: result.rows[0].now });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
