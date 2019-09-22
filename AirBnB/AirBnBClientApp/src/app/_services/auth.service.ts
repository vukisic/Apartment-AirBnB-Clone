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
export class AuthService {

  private baseAddress = 'https://localhost:44371/api/auth/';
  userToken: any;
  decodedToken: any;
  currentUser: User;

  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) { }

  checkForToken() {
    if (this.decodedToken === undefined) {
      this.decodedToken = this.jwtHelperService.decodeToken(this.userToken);
    }
  }

  logIn(model: any) {
    return this.http.post<AuthUser>(this.baseAddress + 'login', model, {headers: new HttpHeaders().set('Content-type', 'application/json')})
    .map(user => {
      if ( user ) {
        this.userToken = user.tokenString;
        localStorage.setItem('token', this.userToken);
        localStorage.setItem('user', JSON.stringify(user.user));
        this.decodedToken = this.jwtHelperService.decodeToken(this.userToken);
        this.currentUser = user.user;
      }
    });
  }

  register(model: User) {
    return this.http.post(this.baseAddress + 'register',
     model, {headers: new HttpHeaders().set('Content-type', 'application/json')})
     .catch(this.handleError);
  }

  loggedIn() {
    const token = this.jwtHelperService.tokenGetter();
    if (!token) {
      return false;
    }
    return !this.jwtHelperService.isTokenExpired(token);
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
