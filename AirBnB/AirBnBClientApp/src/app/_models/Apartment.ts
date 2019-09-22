import { Time } from '@angular/common';
import { Amenitie } from './Amenitie';
import { Host } from './Host';
import { Comment } from './Comment';
import { Photo } from './Photo';

export interface Apartment {
    id: number;
    isDeleted: boolean;
    type: string;
    status: string;
    comments: Comment[];
    photos: Photo[];
    rooms: number;
    guests: number;
    dates: string;
    name: string;
    timeIn: Time;
    timeOut: Time;
    price: number;
    amenities: Amenitie[];
    host: Host;
    hostId: number;
    country: string;
    city: string;
    street: string;
    number: string;
    postCode: string;
    lon: number;
    lat: number;
}
