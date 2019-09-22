import { Time } from '@angular/common';
import { Amenitie } from './Amenitie';

export interface AddApartment {
    name: string;
    type: string;
    photos: any[];
    rooms: number;
    guests: number;
    dates: string;
    timeIn: Time;
    timeOut: Time;
    price: number;
    amenities: Amenitie[];
    hostUsername: string;
    city: string;
    street: string;
    number: string;
    postCode: string;
    lon: number;
    lat: number;
    country: string;
}
