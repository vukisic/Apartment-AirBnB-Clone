import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  photoUrl: string;
  role: string;
  constructor(public authService: AuthService,
              private alertService: AlertifyService,
              private router: Router) { }

  ngOnInit() {
    this.authService.checkForToken();
  }

  login() {
    this.authService.logIn(this.model).subscribe(data => {
      this.alertService.success('LoggedIn Successfully');
      this.role = this.authService.decodedToken.role;
    }, err => {
      this.alertService.error('LogIn Failed!');
    });
  }

  logout() {
    this.authService.userToken = null;
    this.authService.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.alertService.message('LoggedOut Successfully!');
    this.router.navigate(['/home']);
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

}
