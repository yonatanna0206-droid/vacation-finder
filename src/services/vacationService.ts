import type { Accommodation, BookingReservation, SearchFilter } from '../types';
import { db, isFirebaseConfigured } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// Initial sample data for instant local development and UI designing
export const MOCK_PROPERTIES: Accommodation[] = [
  {
    id: 'prop-1',
    name: 'Azure Cove Seaside Resort',
    type: 'resort',
    description: 'Breathtaking oceanfront resort with private beach access and infinity pool.',
    city: 'Santorini',
    country: 'Greece',
    address: 'Caldera Cliffs 12',
    pricePerNight: 280,
    currency: 'USD',
    rating: 4.9,
    reviewsCount: 142,
    images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'],
    amenities: ['WiFi', 'Infinity Pool', 'Spa', 'Breakfast Included', 'Ocean View'],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    isAvailable: true,
  },
  {
    id: 'prop-2',
    name: 'Alpine Vista Chalet',
    type: 'cabin',
    description: 'Cozy timber chalet nestled in the snow-capped mountains with a private hot tub.',
    city: 'Zermatt',
    country: 'Switzerland',
    address: 'Matterhorn Way 4',
    pricePerNight: 350,
    currency: 'USD',
    rating: 4.8,
    reviewsCount: 98,
    images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Fireplace', 'Sauna', 'Ski-in/Ski-out', 'Free Parking', 'Mountain View'],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    isAvailable: true,
  },
  {
    id: 'prop-3',
    name: 'Palazzo Bella Vista',
    type: 'villa',
    description: 'Historic Tuscan villa surrounded by rolling vineyards and olive groves.',
    city: 'Florence',
    country: 'Italy',
    address: 'Via Chiantigiana 88',
    pricePerNight: 420,
    currency: 'USD',
    rating: 4.95,
    reviewsCount: 64,
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Private Pool', 'Wine Cellar', 'Terrace', 'Air Conditioning', 'Chef Service'],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    isAvailable: true,
  },
];

/**
 * Fetches accommodations matching search criteria.
 * Uses Firestore if configured, otherwise falls back to mock dataset.
 */
export async function getAccommodations(filter?: Partial<SearchFilter>): Promise<Accommodation[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'accommodations'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Accommodation[];
      }
    } catch (err) {
      console.warn('Could not read from Firestore, falling back to mock properties:', err);
    }
  }

  let results = [...MOCK_PROPERTIES];

  if (filter?.destination) {
    const term = filter.destination.toLowerCase();
    results = results.filter(
      (p) =>
        p.city.toLowerCase().includes(term) ||
        p.country.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term)
    );
  }

  if (filter?.propertyType && filter.propertyType !== 'all') {
    results = results.filter((p) => p.type === filter.propertyType);
  }

  if (filter?.guests !== undefined) {
    const guestCount = filter.guests;
    results = results.filter((p) => p.maxGuests >= guestCount);
  }

  return results;
}

/**
 * Creates a new booking reservation.
 */
export async function createBooking(
  bookingData: Omit<BookingReservation, 'id' | 'createdAt'>
): Promise<BookingReservation> {
  const newBooking: BookingReservation = {
    ...bookingData,
    id: 'booking-' + Date.now(),
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), newBooking);
      newBooking.id = docRef.id;
    } catch (err) {
      console.warn('Firestore booking write failed:', err);
    }
  }

  return newBooking;
}
