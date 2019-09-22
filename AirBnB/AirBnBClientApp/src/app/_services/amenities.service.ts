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

@Injectable({
  providedIn: 'root'
})
export class AmenitiesService {

  private baseAddress = 'https://localhost:44371/api/amenities/';

  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) { }

  allItems(username: string) {
    return this.http.get<Amenitie[]>(this.baseAddress + 'all/' + username,
     {headers: new HttpHeaders().set('Content-type', 'application/json')})
    .catch(this.handleError);
  }

  add(username: string, name: string) {
    return this.http.post(this.baseAddress + 'add/' + username,
     {name}, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  remove(username: string, name: string) {
    return this.http.post(this.baseAddress + 'remove/' + username,
     {name}, {headers: new HttpHeaders().set('Content-type', 'application/json')})
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
