import { Apartment } from './Apartment';
import { Reservation } from './Reservation';

export interface Host {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    gender: string;
    role: string;
    isBlocked: boolean;
    apartments: Apartment[];
    reservations: Reservation[];
}
