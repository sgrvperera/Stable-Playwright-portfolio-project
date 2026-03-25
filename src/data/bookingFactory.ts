import { futureDate } from '../utils/dates';
import { randomSuffix } from '../utils/random';

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingPayload {
  roomid: number;
  firstname: string;
  lastname: string;
  depositpaid: boolean;
  email: string;
  phone: string;
  bookingdates: BookingDates;
  notes?: string;
}

export function buildBookingPayload(overrides: Partial<BookingPayload> = {}): BookingPayload {
  const suffix = randomSuffix(6);
  return {
    roomid: 1,
    firstname: `Ruchika-${suffix}`,
    lastname: 'Perera',
    depositpaid: true,
    email: `ruchika.${suffix}@example.com`,
    phone: '0771234567',
    bookingdates: {
      checkin: futureDate(7),
      checkout: futureDate(9),
    },
    notes: `Portfolio booking ${suffix}`,
    ...overrides,
  };
}
