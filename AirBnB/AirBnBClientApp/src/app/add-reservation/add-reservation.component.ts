import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { AmenitiesService } from '../_services/amenities.service';
import { ApartmentService } from '../_services/apartment.service';
import { FormBuilder } from '@angular/forms';
import { ReservationsService } from '../_services/reservations.service';
import { Apartment } from '../_models/Apartment';
import { CreateReservation } from '../_models/CreateReservation';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit {

  apartment: Apartment;
  apmDates: string[];
  selectedDate: string;
  days: number;
  price = 0;
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
      this.apartment = data.apm;
      this.apmDates = this.apartment.dates.split(';');
      this.apmDates.splice(this.apmDates.length - 1, 1);
      this.apmDates = this.transformDates(this.apmDates);
      this.price = 0;
    }, err => {
      this.alertSevice.error('Can not get an apartment info!');
    });
  }

  transformDates(arr: string[]) {
    // tslint:disable-next-line: prefer-const
    let newArr: string[] = [];
    // tslint:disable-next-line: prefer-const
    for (let date of arr) {
      // tslint:disable-next-line: prefer-const
      let args = date.split('/');
      newArr.push(args[0] + '/' + args[1] + '/' + args[2]);
    }
    return newArr;
  }

  totalPrice() {
    this.price = this.apartment.price * this.days;
  }

  reserve() {
    const model: any = {
      apartment: this.apartment.name,
      guest: this.authService.decodedToken.unique_name,
      startDate: this.selectedDate,
      days: this.days
    };

    if (model.startDate === undefined || model.days === undefined) {
      this.alertSevice.error('You must populate date and days fields!');
    } else {
      const res: CreateReservation =  Object.assign({}, model);
      console.log(res);
      this.resService.add(res).subscribe( () => {
        this.alertSevice.success('Success!');
      }, () => {
        this.alertSevice.error('Please, check days field!');
      });
    }
  }

}
