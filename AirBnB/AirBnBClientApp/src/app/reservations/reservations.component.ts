import { Component, OnInit } from '@angular/core';
import { ReservationDto } from '../_models/ReservationDto';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { AmenitiesService } from '../_services/amenities.service';
import { ApartmentService } from '../_services/apartment.service';
import { ReservationsService } from '../_services/reservations.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'underscore';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  sortForm: FormGroup = this.formBulider.group({
    criteria: ['']
  });

  filterForm: FormGroup = this.formBulider.group({
    status: ['']
  });

  searchForm: FormGroup = this.formBulider.group({
    user: ['']
  });

  reservations: ReservationDto[];
  constructor(private route: ActivatedRoute,
              public authService: AuthService,
              private alertSevice: AlertifyService,
              private amService: AmenitiesService,
              private apmService: ApartmentService,
              private resService: ReservationsService,
              private formBulider: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe( data => {
      this.reservations = data.res;
      this.transformDates();
      this.createForm();
    }, err => {
      this.alertSevice.error(err);
    });
  }

  createForm() {
    this.sortForm = this.formBulider.group({
      criteria: ['']
    });

    this.filterForm = this.formBulider.group({
      status: ['']
    });

    this.searchForm = this.formBulider.group({
      user: ['']
    });
  }

  sort() {
    if (this.sortForm.get('criteria').value === 'High') {
      // tslint:disable-next-line: only-arrow-functions
      this.reservations = _.sortBy(this.reservations, function(res) {
        return res.totalPrice;
        }).reverse();
    } else {
      // tslint:disable-next-line: only-arrow-functions
      this.reservations = _.sortBy(this.reservations, function(res) {
        return res.totalPrice;
        });
    }
  }

  filterStatus() {
    const criteria: string = this.filterForm.get('status').value;
    this.resService.all(this.authService.decodedToken.role, this.authService.decodedToken.unique_name).subscribe(data => {
      this.reservations = data;
      this.transformDates();
      // tslint:disable-next-line: only-arrow-functions
      this.reservations = _.filter(this.reservations, function(apm) {
        return apm.status === criteria;
        });
    }, err => {
      this.alertSevice.error(err);
    });
  }

  search() {
    const val: string = this.searchForm.get('user').value;
    this.resService.all(this.authService.decodedToken.role, this.authService.decodedToken.unique_name).subscribe(data => {
      this.reservations = data;
      this.transformDates();
      if (val === '') {
        return;
      } else {
        // tslint:disable-next-line: only-arrow-functions
      this.reservations = _.filter(this.reservations, function(apm) {
        return apm.guest.indexOf(val) !== -1;
        });
      }
    }, err => {
      this.alertSevice.error(err);
    });
  }

  load() {
    this.resService.all(this.authService.decodedToken.role, this.authService.decodedToken.unique_name).subscribe(res => {
      this.reservations = res;
      this.transformDates();
      this.createForm();
    }, err => {
      this.alertSevice.error(err);
    });
  }

  accept(id: number) {
    this.resService.accept(id).subscribe( res => {
      this.load();
    }, err => {
      this.alertSevice.error('Reservation status is not created');
    });
  }

  finish(id: number) {
    this.resService.finish(id).subscribe( res => {
      this.load();
    }, err => {
      this.alertSevice.error('Reservation is not over yet!');
    });
  }

  denie(id: number) {
    this.resService.denie(id).subscribe( res => {
      this.load();
    }, err => {
      this.alertSevice.error('Invalid reservation status!');
    });
  }

  quit(id: number) {
    this.resService.quit(id).subscribe( res => {
      this.load();
    }, err => {
      this.alertSevice.error('Invalid reservation status!');
    });
  }

  transformDates(){
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.reservations.length; i++) {
      this.reservations[i].date = this.transformSingleDate(this.reservations[i].date);
    }
  }

  transformSingleDate(date: string) {
    const arr = date.split('/');
    return (arr[1] + '/' + arr[0] + '/' + arr[2]).split(' ')[0];
  }

}
