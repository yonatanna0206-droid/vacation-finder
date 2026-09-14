export type PropertyType = 'hotel' | 'resort' | 'apartment' | 'villa' | 'cabin';

export interface Accommodation {
  id: string;
  name: string;
  type: PropertyType;
  description: string;
  city: string;
  country: string;
  address: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  isAvailable: boolean;
}

export interface SearchFilter {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType | 'all';
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface BookingReservation {
  id: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  totalPrice: number;
  currency: string;
  guestCount: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}
