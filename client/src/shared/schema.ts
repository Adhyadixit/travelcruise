// This is a simplified version of the schema file for client-side use
// It only includes the type definitions and helper functions needed for the client

// Type definitions for models
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Destination {
  id: number;
  name: string;
  country: string;
  imageUrl: string;
  description: string;
  featured: boolean;
  createdAt: Date;
}

export interface Package {
  id: number;
  name: string;
  destinationId: number;
  description: string;
  duration: number;
  price: number;
  imageUrl: string;
  imageGallery?: string;
  included: string;
  excluded?: string;
  rating?: number;
  reviewCount: number;
  trending: boolean;
  featured: boolean;
  itinerary?: string;
  hotels?: string;
  flightIncluded: boolean;
  visaRequired: boolean;
  visaAssistance: boolean;
  typeOfTour?: string;
  citiesCovered?: string;
  meals?: string;
  startingDates?: string;
  travelMode?: string;
  minTravelers: number;
  customizable: boolean;
  highlights?: string;
  createdAt: Date;
  destination?: Destination;
}

export interface Hotel {
  id: number;
  name: string;
  destinationId: number;
  description: string;
  address: string;
  imageUrl: string;
  imageGallery?: string;
  price: number;
  rating?: number;
  reviewCount: number;
  amenities?: string;
  featured: boolean;
  hotelType: 'hotel' | 'resort' | 'villa' | 'independent_house';
  createdAt: Date;
  destination?: Destination;
  roomTypes?: HotelRoomType[];
}

export interface HotelRoomType {
  id: number;
  hotelId: number;
  name: string;
  description: string;
  price: number;
  capacity: number;
  bedType: string;
  amenities?: string;
  imageUrl: string;
  availability: number;
  featured: boolean;
  active: boolean;
  images?: HotelRoomImage[];
  hotel?: Hotel;
}

export interface HotelRoomImage {
  id: number;
  roomTypeId: number;
  imageUrl: string;
  isPrimary: boolean;
  roomType?: HotelRoomType;
}

export interface Driver {
  id: number;
  name: string;
  destinationId: number;
  description: string;
  imageUrl: string;
  rating?: number;
  reviewCount: number;
  languages?: string;
  experience: number;
  pricePerDay: number;
  available: boolean;
  createdAt: Date;
  destination?: Destination;
}

export interface Cab {
  id: number;
  name: string;
  destinationId: number;
  description: string;
  imageUrl: string;
  pricePerDay: number;
  pricePerKm?: number;
  capacity: number;
  carType: string;
  features?: string;
  airConditioned: boolean;
  available: boolean;
  driverIncluded: boolean;
  fuelIncluded: boolean;
  tollsIncluded: boolean;
  multipleStops: boolean;
  createdAt: Date;
  destination?: Destination;
}

export interface Cruise {
  id: number;
  name: string;
  company: string;
  shipName?: string;
  imageUrl: string;
  description: string;
  duration: number;
  price: number;
  departurePort: string;
  arrivalPort: string;
  itinerary?: string;
  cabinTypesInfo?: string; // JSON string of cabin types info
  amenities?: string;
  activities?: string;
  includedServices?: string;
  excludedServices?: string;
  rating?: number;
  reviewCount: number;
  featured: boolean;
  familyFriendly: boolean;
  adultOnly: boolean;
  createdAt: Date;
  cabinTypes?: CruiseCabinType[];
}

export interface CruiseCabinType {
  id: number;
  cruiseId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  features?: string;
  availability: number;
  capacity: number;
  featured: boolean;
  active: boolean;
  cruise?: Cruise;
}

export interface Event {
  id: number;
  name: string;
  destinationId: number;
  description: string;
  imageUrl: string;
  startDate: Date;
  endDate: Date;
  location: string;
  price: number;
  category: string;
  featured: boolean;
  limitedSeats: boolean;
  availableSeats?: number;
  createdAt: Date;
  destination?: Destination;
}

export interface Booking {
  id: number;
  userId: number;
  bookingType: string;
  itemId: number;
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  transactionId?: string;
  specialRequests?: string;
  createdAt: Date;
  user?: User;
}

export interface Review {
  id: number;
  userId: number;
  itemType: string;
  itemId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  user?: User;
}

// Helper interfaces
export interface BookingWithExtras extends Booking {
  packageDetails?: Package;
  hotelDetails?: Hotel;
  cabDetails?: Cab;
  cruiseDetails?: Cruise;
  eventDetails?: Event;
}

export interface UserWithFullName extends User {
  fullName: string;
  phone: string;
}

// Helper functions
export function getBookingWithExtras(booking: Booking): BookingWithExtras {
  return {
    ...booking,
    // In a real app, this would fetch the related entity details
  };
}

export function getUserWithFullName(user: User): UserWithFullName {
  return {
    ...user,
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    phone: user.phoneNumber || '',
  };
}

// Schema validation
export const insertBookingSchema = {
  userId: { type: 'number' },
  bookingType: { type: 'string' },
  itemId: { type: 'number' },
  startDate: { type: 'date' },
  endDate: { type: 'date' },
  adults: { type: 'number' },
  children: { type: 'number' },
  status: { type: 'string' },
  paymentStatus: { type: 'string' },
  totalPrice: { type: 'number' },
  specialRequests: { type: 'string', optional: true },
};

export const insertReviewSchema = {
  userId: { type: 'number' },
  itemType: { type: 'string' },
  itemId: { type: 'number' },
  rating: { type: 'number' },
  comment: { type: 'string' },
};

export const insertDestinationSchema = {
  name: { type: 'string' },
  country: { type: 'string' },
  imageUrl: { type: 'string' },
  description: { type: 'string' },
  featured: { type: 'boolean', optional: true },
};

export const insertPackageSchema = {
  name: { type: 'string' },
  destinationId: { type: 'number' },
  description: { type: 'string' },
  duration: { type: 'number' },
  price: { type: 'number' },
  imageUrl: { type: 'string' },
  included: { type: 'string' },
};

export const insertHotelSchema = {
  name: { type: 'string' },
  destinationId: { type: 'number' },
  description: { type: 'string' },
  address: { type: 'string' },
  imageUrl: { type: 'string' },
  price: { type: 'number' },
};

export const insertCabSchema = {
  name: { type: 'string' },
  destinationId: { type: 'number' },
  description: { type: 'string' },
  imageUrl: { type: 'string' },
  pricePerDay: { type: 'number' },
  capacity: { type: 'number' },
  carType: { type: 'string' },
};

export const insertCruiseSchema = {
  name: { type: 'string' },
  company: { type: 'string' },
  imageUrl: { type: 'string' },
  description: { type: 'string' },
  duration: { type: 'number' },
  price: { type: 'number' },
  departurePort: { type: 'string' },
  arrivalPort: { type: 'string' },
};

export const insertCruiseCabinTypeSchema = {
  cruiseId: { type: 'number' },
  name: { type: 'string' },
  description: { type: 'string' },
  price: { type: 'number' },
  image: { type: 'string' },
  availability: { type: 'number' },
  capacity: { type: 'number' },
};

export const insertEventSchema = {
  name: { type: 'string' },
  destinationId: { type: 'number' },
  description: { type: 'string' },
  imageUrl: { type: 'string' },
  startDate: { type: 'date' },
  endDate: { type: 'date' },
  location: { type: 'string' },
  price: { type: 'number' },
  category: { type: 'string' },
};

export const InsertHotelRoomType = {
  hotelId: { type: 'number' },
  name: { type: 'string' },
  description: { type: 'string' },
  price: { type: 'number' },
  capacity: { type: 'number' },
  bedType: { type: 'string' },
  imageUrl: { type: 'string' },
  availability: { type: 'number' },
};
