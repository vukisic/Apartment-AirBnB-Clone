import { Reservation } from './Reservation';

export interface Guest {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    gender: string;
    role: string;
    isBlocked: boolean;
    reservations: Reservation[];
}
