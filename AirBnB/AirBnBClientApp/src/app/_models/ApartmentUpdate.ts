import { Time } from '@angular/common';
import { Amenitie } from './Amenitie';

export interface ApartmentUpdate {
    name: string;
    type: string;
    rooms: number;
    guests: number;
    dates: string;
    datesUpdate: boolean;
    timeIn: Time;
    timeOut: Time;
    price: number;
    amenities: Amenitie[];
}
