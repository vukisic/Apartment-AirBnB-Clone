import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/catch';
import { ApartmentService } from '../_services/apartment.service';
import { Apartment } from '../_models/Apartment';
import { ReservationDto } from '../_models/ReservationDto';
import { ReservationsService } from '../_services/reservations.service';
import { AuthService } from '../_services/auth.service';


@Injectable()
export class ReservationsResolver implements Resolve<ReservationDto[]> {
    constructor(private authService: AuthService,
                private router: Router,
                private alertService: AlertifyService,
                private resService: ReservationsService) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<ReservationDto[]>  {
        return this.resService.all(this.authService.decodedToken.role, this.authService.decodedToken.unique_name).catch(err => {
            this.alertService.error('Problem with getting data!');
            this.router.navigate(['/home']);
            return of(null);
        });
    }
}