import { Apartment } from './Apartment';
import { Guest } from './Guest';

export interface Comment {
    id: number;
    status: string;
    guest: string;
    text: string;
    rating: number;
}
