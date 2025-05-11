import type { VercelRequest, VercelResponse } from '@vercel/node';

// Sample events data
const events = [
  {
    id: 1,
    name: "Paris Fashion Week",
    destinationId: 1,
    description: "Experience the glamour of Paris Fashion Week with exclusive runway shows, designer exhibitions, and fashion events throughout the city.",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhc2hpb24lMjBzaG93fGVufDB8fDB8fHww",
    startDate: "2025-09-28T00:00:00.000Z",
    endDate: "2025-10-06T00:00:00.000Z",
    location: "Various venues across Paris",
    price: 299,
    category: "Fashion",
    featured: true,
    limitedSeats: true,
    availableSeats: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Bali Arts Festival",
    destinationId: 2,
    description: "Immerse yourself in Balinese culture at this month-long celebration featuring traditional dance, music, crafts, and culinary arts from across the island.",
    imageUrl: "https://images.unsplash.com/photo-1604913770380-0d383a0149b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJhbGklMjBkYW5jZXxlbnwwfHwwfHx8MA%3D%3D",
    startDate: "2025-06-13T00:00:00.000Z",
    endDate: "2025-07-11T00:00:00.000Z",
    location: "Denpasar Arts Centre, Bali",
    price: 75,
    category: "Cultural",
    featured: true,
    limitedSeats: false,
    availableSeats: 200,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Tokyo Summer Festival",
    destinationId: 3,
    description: "Celebrate summer in Tokyo with traditional festivals, fireworks displays, food stalls, and cultural performances throughout the city.",
    imageUrl: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8amFwYW5lc2UlMjBmZXN0aXZhbHxlbnwwfHwwfHx8MA%3D%3D",
    startDate: "2025-07-15T00:00:00.000Z",
    endDate: "2025-08-15T00:00:00.000Z",
    location: "Various venues across Tokyo",
    price: 120,
    category: "Cultural",
    featured: false,
    limitedSeats: false,
    availableSeats: 500,
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
    // Check if a specific event ID is requested
    const { id, destinationId } = req.query;
    
    if (id) {
      const event = events.find(e => e.id === parseInt(id as string));
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ error: 'Event not found' });
      }
    } else if (destinationId) {
      // Return events for a specific destination
      const destinationEvents = events.filter(e => e.destinationId === parseInt(destinationId as string));
      res.status(200).json(destinationEvents);
    } else {
      // Return all events
      res.status(200).json(events);
    }
    return;
  }

  // Handle unsupported methods
  res.status(405).json({ error: 'Method not allowed' });
}
