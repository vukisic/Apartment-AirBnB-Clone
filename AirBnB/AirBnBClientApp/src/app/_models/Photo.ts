import { Apartment } from './Apartment';

export interface Photo {
    id: number;
    url: string;
    publicId: string;
    apartment: Apartment;
    apartmentId: number;
}
