import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/catch';
import { ApartmentService } from '../_services/apartment.service';
import { Apartment } from '../_models/Apartment';


@Injectable()
export class ApartmentResolver implements Resolve<Apartment> {
    constructor(private apmService: ApartmentService,
                private router: Router,
                private alertService: AlertifyService) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<Apartment>  {
        return this.apmService.single(route.params.name).catch(err => {
            this.alertService.error('Problem with getting data!');
            this.router.navigate(['/home']);
            return of(null);
        });
    }
}
