import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthUser } from '../_models/authUser';
import { Amenitie } from '../_models/Amenitie';
import { AddApartment } from '../_models/AddApartment';
import { Apartment } from '../_models/Apartment';
import { ApartmentUpdate } from '../_models/ApartmentUpdate';
import { CommentStatusDto } from '../_models/CommentStatusDto';
import { AddCommentDto } from '../_models/AddCommentDto';
import { CreateReservation } from '../_models/CreateReservation';
import { ReservationDto } from '../_models/ReservationDto';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  private baseAddress = 'https://localhost:44371/api/reservations/';

  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) { }

  add(res: CreateReservation) {
    return this.http.post(this.baseAddress + 'add/',
     res, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  all(role: string, name: string) {
    return this.http.get<ReservationDto[]>(this.baseAddress + 'all/' + role + '/' + name + '/',
    {headers: new HttpHeaders().set('Content-type', 'application/json')})
   .catch(this.handleError);
  }

  accept(id: number) {
    return this.http.put(this.baseAddress + 'accept/' + id,
     {}, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  denie(id: number) {
    return this.http.put(this.baseAddress + 'denie/' + id,
     {}, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  quit(id: number) {
    return this.http.put(this.baseAddress + 'quit/' + id,
     {}, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  finish(id: number) {
    return this.http.put(this.baseAddress + 'finish/' + id,
     {}, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  private handleError(error: any) {
    console.log(error);
    const appError = error.headers.get('Application-Error');
    if (appError) {
      // tslint:disable-next-line: deprecation
      return Observable.throw(appError);
    }
    // tslint:disable-next-line: deprecation
    return Observable.throw('Server Error');
  }

}
