import { Apartment } from './Apartment';
import { Guest } from './Guest';

export interface Reservation {
    id: number;
    status: string;
    apartment: Apartment;
    apartmentId: number;
    guest: Guest;
    guestId: number;
    date: Date;
    number: number;
    totalPrice: number;
}
