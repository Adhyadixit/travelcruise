import type { VercelRequest, VercelResponse } from '@vercel/node';

// Sample users data
const users = [
  {
    id: 1,
    username: "admin",
    // In a real app, this would be a hashed password
    password: "admin123",
    email: "admin@travelnexus.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    username: "user",
    // In a real app, this would be a hashed password
    password: "user123",
    email: "user@example.com",
    firstName: "Regular",
    lastName: "User",
    role: "user",
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

  // Handle POST request for login
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Find user with matching username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // In a real app, you would generate a JWT token here
      const token = "mock-jwt-token-" + Date.now();
      
      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json({
        user: userWithoutPassword,
        token
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
    return;
  }

  // Handle unsupported methods
  res.status(405).json({ error: 'Method not allowed' });
}
