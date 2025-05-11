import type { VercelRequest, VercelResponse } from '@vercel/node';

// Sample hotels data
const hotels = [
  {
    id: 1,
    name: "Le Grand Paris Hotel",
    destinationId: 1,
    description: "Experience luxury in the heart of Paris with stunning Eiffel Tower views and world-class amenities.",
    address: "15 Avenue des Champs-Élysées, 75008 Paris, France",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWx8ZW58MHx8MHx8fDA%3D",
    imageGallery: JSON.stringify([
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D"
    ]),
    price: 350,
    rating: 4.8,
    reviewCount: 520,
    amenities: JSON.stringify([
      "Free WiFi",
      "Spa",
      "Fitness center",
      "Restaurant",
      "Room service",
      "Concierge",
      "Airport shuttle",
      "Swimming pool"
    ]),
    featured: true,
    hotelType: "hotel",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Bali Beachfront Resort",
    destinationId: 2,
    description: "Luxurious beachfront resort in Bali with private villas, infinity pools, and spectacular ocean views.",
    address: "Jl. Pantai Kuta No. 32, Kuta, Bali 80361, Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzb3J0fGVufDB8fDB8fHww",
    imageGallery: JSON.stringify([
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzb3J0JTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzb3J0JTIwcG9vbHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1540304453527-62f979142a17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJlc29ydCUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D"
    ]),
    price: 450,
    rating: 4.9,
    reviewCount: 735,
    amenities: JSON.stringify([
      "Free WiFi",
      "Spa",
      "Fitness center",
      "Multiple restaurants",
      "Room service",
      "Concierge",
      "Private beach",
      "Infinity pool",
      "Water sports",
      "Yoga classes"
    ]),
    featured: true,
    hotelType: "resort",
    createdAt: new Date().toISOString()
  }
];

// Sample room types data
const roomTypes = [
  {
    id: 1,
    hotelId: 1,
    name: "Deluxe King Room",
    description: "Spacious room with king-size bed and Eiffel Tower view",
    price: 350,
    capacity: 2,
    bedType: "King",
    amenities: JSON.stringify([
      "Air conditioning",
      "Flat-screen TV",
      "Mini bar",
      "Safe",
      "Free WiFi",
      "Coffee maker"
    ]),
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww",
    availability: 5,
    featured: true,
    active: true
  },
  {
    id: 2,
    hotelId: 1,
    name: "Executive Suite",
    description: "Luxury suite with separate living area and panoramic city views",
    price: 550,
    capacity: 2,
    bedType: "King",
    amenities: JSON.stringify([
      "Air conditioning",
      "Flat-screen TV",
      "Mini bar",
      "Safe",
      "Free WiFi",
      "Coffee maker",
      "Separate living area",
      "Bathtub",
      "Complimentary breakfast",
      "Evening turndown service"
    ]),
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdGVsJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    availability: 2,
    featured: true,
    active: true
  },
  {
    id: 3,
    hotelId: 2,
    name: "Garden Villa",
    description: "Private villa with garden view and outdoor shower",
    price: 450,
    capacity: 2,
    bedType: "King",
    amenities: JSON.stringify([
      "Air conditioning",
      "Flat-screen TV",
      "Mini bar",
      "Safe",
      "Free WiFi",
      "Coffee maker",
      "Private garden",
      "Outdoor shower",
      "Daybed"
    ]),
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzb3J0JTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    availability: 8,
    featured: true,
    active: true
  },
  {
    id: 4,
    hotelId: 2,
    name: "Ocean View Villa",
    description: "Luxury villa with private pool and direct ocean views",
    price: 750,
    capacity: 2,
    bedType: "King",
    amenities: JSON.stringify([
      "Air conditioning",
      "Flat-screen TV",
      "Mini bar",
      "Safe",
      "Free WiFi",
      "Coffee maker",
      "Private pool",
      "Ocean view",
      "Outdoor dining area",
      "Butler service",
      "Complimentary breakfast"
    ]),
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlsbGF8ZW58MHx8MHx8fDA%3D",
    availability: 3,
    featured: true,
    active: true
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
    // Check if a specific hotel ID is requested
    const { id } = req.query;
    
    if (id) {
      const hotel = hotels.find(h => h.id === parseInt(id as string));
      if (hotel) {
        // Add room types to the hotel
        const hotelRoomTypes = roomTypes.filter(rt => rt.hotelId === hotel.id);
        const hotelWithRoomTypes = {
          ...hotel,
          roomTypes: hotelRoomTypes
        };
        res.status(200).json(hotelWithRoomTypes);
      } else {
        res.status(404).json({ error: 'Hotel not found' });
      }
    } else {
      // Return all hotels
      res.status(200).json(hotels);
    }
    return;
  }

  // Handle unsupported methods
  res.status(405).json({ error: 'Method not allowed' });
}
