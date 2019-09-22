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

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseAddress = 'https://localhost:44371/api/user/';

  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) { }

  allUsers(username: string) {
    return this.http.get<User[]>(this.baseAddress + username, {headers: new HttpHeaders().set('Content-type', 'application/json')})
    .catch(this.handleError);
  }

  block(username: string) {
    return this.http.post(this.baseAddress + 'block/' + username,
     {}, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  unblock(username: string) {
    return this.http.post(this.baseAddress + 'unblock/' + username,
     {}, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  getUser(username: string) {
    return this.http.get<User>(this.baseAddress + 'get/' + username, {headers: new HttpHeaders().set('Content-type', 'application/json')})
    .catch(this.handleError);
  }

  updateUser(model: any) {
    return this.http.put(this.baseAddress + 'updateUser',
     model, {headers: new HttpHeaders().set('Content-type', 'application/json')})
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
