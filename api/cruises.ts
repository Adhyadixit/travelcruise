import type { VercelRequest, VercelResponse } from '@vercel/node';

// Sample cruises data
const cruises = [
  {
    id: 1,
    name: "Mediterranean Odyssey",
    company: "Royal Caribbean",
    shipName: "Odyssey of the Seas",
    imageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3J1aXNlJTIwc2hpcHxlbnwwfHwwfHx8MA%3D%3D",
    description: "Experience the beauty of the Mediterranean with stops in Italy, Greece, and Spain.",
    duration: 7,
    price: 1299,
    departurePort: "Barcelona, Spain",
    arrivalPort: "Barcelona, Spain",
    itinerary: JSON.stringify({
      "day1": "Departure from Barcelona",
      "day2": "At sea",
      "day3": "Rome (Civitavecchia), Italy",
      "day4": "Florence/Pisa (Livorno), Italy",
      "day5": "Santorini, Greece",
      "day6": "Athens (Piraeus), Greece",
      "day7": "At sea",
      "day8": "Return to Barcelona"
    }),
    cabinTypesInfo: JSON.stringify([
      "Interior",
      "Ocean View",
      "Balcony",
      "Suite"
    ]),
    amenities: JSON.stringify([
      "Swimming pools",
      "Spa",
      "Fitness center",
      "Multiple restaurants",
      "Casino",
      "Theater",
      "Kids club"
    ]),
    activities: JSON.stringify([
      "Live shows",
      "Cooking classes",
      "Dance lessons",
      "Wine tasting",
      "Rock climbing",
      "Mini golf"
    ]),
    includedServices: JSON.stringify([
      "Accommodation",
      "All meals",
      "Entertainment",
      "Port charges and taxes"
    ]),
    excludedServices: JSON.stringify([
      "Flights",
      "Shore excursions",
      "Specialty dining",
      "Alcoholic beverages",
      "Spa treatments",
      "Gratuities"
    ]),
    rating: 4.7,
    reviewCount: 320,
    featured: true,
    familyFriendly: true,
    adultOnly: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Caribbean Paradise",
    company: "Norwegian Cruise Line",
    shipName: "Norwegian Escape",
    imageUrl: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3J1aXNlJTIwc2hpcHxlbnwwfHwwfHx8MA%3D%3D",
    description: "Explore the stunning Caribbean islands with stops in the Bahamas, Jamaica, and Mexico.",
    duration: 7,
    price: 1099,
    departurePort: "Miami, Florida",
    arrivalPort: "Miami, Florida",
    itinerary: JSON.stringify({
      "day1": "Departure from Miami",
      "day2": "At sea",
      "day3": "Nassau, Bahamas",
      "day4": "Ocho Rios, Jamaica",
      "day5": "George Town, Grand Cayman",
      "day6": "Cozumel, Mexico",
      "day7": "At sea",
      "day8": "Return to Miami"
    }),
    cabinTypesInfo: JSON.stringify([
      "Interior",
      "Ocean View",
      "Balcony",
      "The Haven (Suite)"
    ]),
    amenities: JSON.stringify([
      "Aqua Park",
      "Spa",
      "Fitness center",
      "Multiple restaurants",
      "Casino",
      "Theater",
      "Sports complex"
    ]),
    activities: JSON.stringify([
      "Broadway shows",
      "Comedy club",
      "Dance classes",
      "Wine tasting",
      "Ropes course",
      "Water slides"
    ]),
    includedServices: JSON.stringify([
      "Accommodation",
      "All meals in main dining venues",
      "Entertainment",
      "Port charges and taxes"
    ]),
    excludedServices: JSON.stringify([
      "Flights",
      "Shore excursions",
      "Specialty dining",
      "Alcoholic beverages",
      "Spa treatments",
      "Gratuities"
    ]),
    rating: 4.6,
    reviewCount: 450,
    featured: true,
    familyFriendly: true,
    adultOnly: false,
    createdAt: new Date().toISOString()
  }
];

// Sample cabin types data
const cabinTypes = [
  {
    id: 1,
    cruiseId: 1,
    name: "Interior Stateroom",
    description: "Comfortable interior cabin with all essential amenities",
    price: 1299,
    image: "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNydWlzZSUyMGNhYmlufGVufDB8fDB8fHww",
    features: JSON.stringify([
      "Twin beds that convert to Royal King",
      "Private bathroom with shower",
      "TV, telephone, and safe",
      "Mini-fridge",
      "Hair dryer"
    ]),
    availability: 20,
    capacity: 2,
    featured: false,
    active: true
  },
  {
    id: 2,
    cruiseId: 1,
    name: "Ocean View Stateroom",
    description: "Stateroom with a window or porthole offering ocean views",
    price: 1499,
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
    features: JSON.stringify([
      "Twin beds that convert to Royal King",
      "Private bathroom with shower",
      "TV, telephone, and safe",
      "Mini-fridge",
      "Hair dryer",
      "Window with ocean view"
    ]),
    availability: 15,
    capacity: 2,
    featured: true,
    active: true
  },
  {
    id: 3,
    cruiseId: 1,
    name: "Balcony Stateroom",
    description: "Spacious stateroom with private balcony and sea views",
    price: 1799,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWx8ZW58MHx8MHx8fDA%3D",
    features: JSON.stringify([
      "Twin beds that convert to Royal King",
      "Private bathroom with shower",
      "TV, telephone, and safe",
      "Mini-fridge",
      "Hair dryer",
      "Private balcony with seating area",
      "Floor-to-ceiling sliding glass doors"
    ]),
    availability: 10,
    capacity: 2,
    featured: true,
    active: true
  },
  {
    id: 4,
    cruiseId: 2,
    name: "Interior Stateroom",
    description: "Stylish interior cabin with modern amenities",
    price: 1099,
    image: "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNydWlzZSUyMGNhYmlufGVufDB8fDB8fHww",
    features: JSON.stringify([
      "Two lower beds that convert to a queen-size bed",
      "Private bathroom with shower",
      "TV, telephone, and safe",
      "Mini-fridge",
      "Hair dryer"
    ]),
    availability: 25,
    capacity: 2,
    featured: false,
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
    // Check if a specific cruise ID is requested
    const { id } = req.query;
    
    if (id) {
      const cruise = cruises.find(c => c.id === parseInt(id as string));
      if (cruise) {
        // Add cabin types to the cruise
        const cruiseCabinTypes = cabinTypes.filter(ct => ct.cruiseId === cruise.id);
        const cruiseWithCabinTypes = {
          ...cruise,
          cabinTypes: cruiseCabinTypes
        };
        res.status(200).json(cruiseWithCabinTypes);
      } else {
        res.status(404).json({ error: 'Cruise not found' });
      }
    } else {
      // Return all cruises
      res.status(200).json(cruises);
    }
    return;
  }

  // Handle unsupported methods
  res.status(405).json({ error: 'Method not allowed' });
}
