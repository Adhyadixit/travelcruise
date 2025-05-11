import type { VercelRequest, VercelResponse } from '@vercel/node';

// Sample packages data
const packages = [
  {
    id: 1,
    name: "Paris Explorer",
    destinationId: 1,
    description: "Experience the magic of Paris with this comprehensive 7-day tour package.",
    duration: 7,
    price: 1299.99,
    imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFyaXN8ZW58MHx8MHx8fDA%3D",
    included: JSON.stringify([
      "Hotel accommodation",
      "Daily breakfast",
      "City tour",
      "Seine River cruise",
      "Eiffel Tower visit",
      "Louvre Museum entry"
    ]),
    excluded: JSON.stringify([
      "Flights",
      "Travel insurance",
      "Personal expenses",
      "Optional activities"
    ]),
    rating: 4.8,
    reviewCount: 124,
    trending: true,
    featured: true,
    itinerary: JSON.stringify({
      "day1": "Arrival and hotel check-in",
      "day2": "Eiffel Tower and Seine River cruise",
      "day3": "Louvre Museum and Tuileries Garden",
      "day4": "Montmartre and Sacré-Cœur",
      "day5": "Versailles Palace day trip",
      "day6": "Shopping and free time",
      "day7": "Departure"
    }),
    flightIncluded: false,
    visaRequired: true,
    visaAssistance: true,
    typeOfTour: "Group",
    citiesCovered: JSON.stringify(["Paris", "Versailles"]),
    meals: JSON.stringify({
      "breakfast": true,
      "lunch": false,
      "dinner": false
    }),
    startingDates: JSON.stringify([
      "2025-06-15",
      "2025-07-10",
      "2025-08-05",
      "2025-09-20"
    ]),
    travelMode: "Train",
    minTravelers: 2,
    customizable: true,
    highlights: JSON.stringify([
      "Skip-the-line Eiffel Tower access",
      "Evening Seine cruise with dinner option",
      "Guided Louvre tour",
      "Day trip to Versailles Palace",
      "Local culinary experience"
    ]),
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Bali Paradise",
    destinationId: 2,
    description: "Discover the beauty of Bali with this 10-day tropical getaway package.",
    duration: 10,
    price: 1599.99,
    imageUrl: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFsaXxlbnwwfHwwfHx8MA%3D%3D",
    included: JSON.stringify([
      "Villa accommodation",
      "Daily breakfast",
      "Airport transfers",
      "Island tour",
      "Temple visits",
      "Spa treatment"
    ]),
    excluded: JSON.stringify([
      "Flights",
      "Travel insurance",
      "Personal expenses",
      "Optional activities"
    ]),
    rating: 4.9,
    reviewCount: 210,
    trending: true,
    featured: true,
    itinerary: JSON.stringify({
      "day1": "Arrival and villa check-in",
      "day2": "Ubud cultural tour",
      "day3": "Rice terraces and temples",
      "day4": "Mount Batur sunrise trek",
      "day5": "Spa and relaxation day",
      "day6": "Nusa Penida island tour",
      "day7": "Uluwatu Temple and beach day",
      "day8": "Water sports and activities",
      "day9": "Free day for shopping and relaxation",
      "day10": "Departure"
    }),
    flightIncluded: false,
    visaRequired: false,
    visaAssistance: false,
    typeOfTour: "Private",
    citiesCovered: JSON.stringify(["Kuta", "Ubud", "Nusa Dua", "Uluwatu"]),
    meals: JSON.stringify({
      "breakfast": true,
      "lunch": false,
      "dinner": false
    }),
    startingDates: JSON.stringify([
      "2025-06-01",
      "2025-07-15",
      "2025-08-10",
      "2025-09-05"
    ]),
    travelMode: "Car",
    minTravelers: 1,
    customizable: true,
    highlights: JSON.stringify([
      "Private villa with pool",
      "Traditional Balinese massage",
      "Sunrise trek to Mount Batur",
      "Nusa Penida island day trip",
      "Traditional dance performance"
    ]),
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
    // Check if a specific package ID is requested
    const { id } = req.query;
    
    if (id) {
      const packageItem = packages.find(p => p.id === parseInt(id as string));
      if (packageItem) {
        res.status(200).json(packageItem);
      } else {
        res.status(404).json({ error: 'Package not found' });
      }
    } else {
      // Return all packages
      res.status(200).json(packages);
    }
    return;
  }

  // Handle unsupported methods
  res.status(405).json({ error: 'Method not allowed' });
}
