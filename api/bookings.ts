import type { VercelRequest, VercelResponse } from '@vercel/node';

// Sample bookings data
const bookings = [
  {
    id: 1,
    userId: 2,
    bookingType: "package",
    itemId: 1,
    startDate: "2025-06-15T00:00:00.000Z",
    endDate: "2025-06-22T00:00:00.000Z",
    adults: 2,
    children: 0,
    status: "confirmed",
    paymentStatus: "paid",
    totalPrice: 2599.98,
    transactionId: "TXN123456789",
    specialRequests: "Early check-in if possible",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 2,
    bookingType: "hotel",
    itemId: 1,
    startDate: "2025-07-10T00:00:00.000Z",
    endDate: "2025-07-15T00:00:00.000Z",
    adults: 2,
    children: 1,
    status: "confirmed",
    paymentStatus: "paid",
    totalPrice: 1750,
    transactionId: "TXN987654321",
    specialRequests: "High floor room preferred",
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
    // Check if a specific booking ID is requested
    const { id, userId } = req.query;
    
    if (id) {
      const booking = bookings.find(b => b.id === parseInt(id as string));
      if (booking) {
        res.status(200).json(booking);
      } else {
        res.status(404).json({ error: 'Booking not found' });
      }
    } else if (userId) {
      // Return bookings for a specific user
      const userBookings = bookings.filter(b => b.userId === parseInt(userId as string));
      res.status(200).json(userBookings);
    } else {
      // Return all bookings
      res.status(200).json(bookings);
    }
    return;
  }

  // Handle POST request for creating a new booking
  if (req.method === 'POST') {
    try {
      const bookingData = req.body;
      
      // In a real app, you would validate the data and save to a database
      // For this mock API, we'll just return a success response
      
      const newBooking = {
        id: bookings.length + 1,
        ...bookingData,
        status: "confirmed",
        paymentStatus: "paid",
        transactionId: "TXN" + Date.now(),
        createdAt: new Date().toISOString()
      };
      
      res.status(201).json(newBooking);
    } catch (error) {
      res.status(400).json({ error: 'Invalid booking data' });
    }
    return;
  }

  // Handle unsupported methods
  res.status(405).json({ error: 'Method not allowed' });
}
