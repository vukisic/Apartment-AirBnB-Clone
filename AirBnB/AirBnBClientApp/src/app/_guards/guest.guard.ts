import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router,
              private alertService: AlertifyService) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.decodedToken.role !== 'Guest') {
      this.alertService.error('Not Authorize!');
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}