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

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  private baseAddress = 'https://localhost:44371/api/apartments/';

  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) { }

  add(apm: AddApartment) {
    return this.http.post(this.baseAddress + 'add/',
     apm, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  remove(name: string) {
    return this.http.post(this.baseAddress + 'remove/' + name,
     {}, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  changeCommentStatus(dto: CommentStatusDto) {
    return this.http.post(this.baseAddress + 'comment/status/',
     dto, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  addComment(dto: AddCommentDto) {
    return this.http.post(this.baseAddress + 'comment/',
     dto, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  update(name: string, model: ApartmentUpdate) {
    return this.http.put(this.baseAddress + 'update/' + name,
     model, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  search(model: any) {
    return this.http.post<Apartment[]>(this.baseAddress + 'search/', model,
    {headers: new HttpHeaders().set('Content-type', 'application/json')})
   .catch(this.handleError);
  }

  all() {
    return this.http.get<Apartment[]>(this.baseAddress + 'all/',
    {headers: new HttpHeaders().set('Content-type', 'application/json')})
   .catch(this.handleError);
  }

  single(name: string) {
    return this.http.get<Apartment>(this.baseAddress + 'single/' + name,
    {headers: new HttpHeaders().set('Content-type', 'application/json')})
   .catch(this.handleError);
  }

  changeStatus(name: string) {
    return this.http.get(this.baseAddress + 'status/' + name,
    {headers: new HttpHeaders().set('Content-type', 'application/json')})
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
