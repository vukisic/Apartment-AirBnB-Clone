import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { AmenitiesService } from '../_services/amenities.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApartmentService } from '../_services/apartment.service';
import { Apartment } from '../_models/Apartment';
import * as _ from 'underscore';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/ngx-bootstrap-datepicker';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.css']
})
export class ApartmentsComponent implements OnInit {

  apartments: Apartment[];
  sortForm: FormGroup = this.formBulider.group({
    criteria: ['']
  });

  filterForm: FormGroup = this.formBulider.group({
    criteria: [''],
    status: ['']
  });

  searchForm: FormGroup = this.formBulider.group({
    dates: [],
    city: [],
    country: [],
    price: [],
    rooms: [],
    guests: []

  });

  colorTheme = 'theme-green';
  bsConfig: Partial<BsDatepickerConfig>;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

  allcities: any[] = [];
  allcountries: any[] = [];

  priceMinValue = 0;
  priceMaxValue = 100;
  priceOptions: Options = {
    floor: 0,
    ceil: 100
  };

  roomsValue = 0;
  roomsOptions: Options = {
    floor: 0,
    ceil: 10
  };

  guestsValue = 0;
  guestsOptions: Options = {
    floor: 0,
    ceil: 10
  };

  constructor(public authService: AuthService,
              private alertSevice: AlertifyService,
              private amService: AmenitiesService,
              private apmService: ApartmentService,
              private formBulider: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.apartments = data.apms;
      this.createForm();
    }, err => {
      this.alertSevice.error(err);
    });
  }

  createForm() {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });

    this.sortForm = this.formBulider.group({
      criteria: ['']
    });

    this.filterForm = this.formBulider.group({
      criteria: [''],
      status: ['']
    });

    this.searchForm = this.formBulider.group({
      dates: [],
      city: [],
      country: [],
      price: [],
      rooms: [],
      guests: []
    });

    for (const apm of this.apartments) {
      if (!this.exist(this.allcities, apm.city)) {
        this.allcities.push({name: apm.city});
      }
      if (!this.exist(this.allcountries, apm.country)) {
        this.allcountries.push({name: apm.country});
      }
    }

    this.priceMinValue = 0;
    this.priceMaxValue = 100;
    this.priceOptions = {
      floor: 0,
      ceil: 100
    };

    this.roomsValue = 0;
    this.roomsOptions = {
      floor: 0,
      ceil: 10
    };

    this.guestsValue = 0;
    this.guestsOptions = {
      floor: 0,
      ceil: 10
    };
  }

  exist(arr: any[], item: string) {
    for (const it of arr) {
      // tslint:disable-next-line: no-string-literal
      if (it['name'] === item) {
        return true;
      }
    }
    return false;
  }

  remove(name: string) {
    this.apmService.remove(name).subscribe( r => {
      this.alertSevice.success('Success!');
      this.apmService.all().subscribe(res => {
        this.apartments = res;
      }, err => {
        this.alertSevice.error(err);
      });
    }, err => {
      this.alertSevice.error(err);
    });
  }

  changeStatus(name: string) {
    this.apmService.changeStatus(name).subscribe( res => {
      this.apmService.all().subscribe(data => {
        this.apartments = data;
      }, err => {
        this.alertSevice.error(err);
      });
    }, err => {
      this.alertSevice.error(err);
    });
  }

  sort() {
    if (this.sortForm.get('criteria').value === 'High') {
      // tslint:disable-next-line: only-arrow-functions
      this.apartments = _.sortBy(this.apartments, function(apm) {
        return apm.price;
        }).reverse();
    } else {
      // tslint:disable-next-line: only-arrow-functions
      this.apartments = _.sortBy(this.apartments, function(apm) {
        return apm.price;
        });
    }
  }

  filterType() {
    this.apmService.all().subscribe(data => {
      this.apartments = data;
      if (this.filterForm.get('criteria').value === 'Room') {
        // tslint:disable-next-line: only-arrow-functions
        this.apartments = _.filter(this.apartments, function(apm) {
          return apm.type === 'Room';
          });
      } else {
        // tslint:disable-next-line: only-arrow-functions
        this.apartments = _.filter(this.apartments, function(apm) {
          return apm.type === 'Whole';
          });
      }
    }, err => {
      this.alertSevice.error(err);
    });
  }

  filterStatus() {
    this.apmService.all().subscribe(data => {
      this.apartments = data;
      if (this.filterForm.get('status').value === 'Active') {
        // tslint:disable-next-line: only-arrow-functions
        this.apartments = _.filter(this.apartments, function(apm) {
          return apm.status === 'Active';
          });
      } else {
        // tslint:disable-next-line: only-arrow-functions
        this.apartments = _.filter(this.apartments, function(apm) {
          return apm.status === 'InActive';
          });
      }
    }, err => {
      this.alertSevice.error(err);
    });
  }

  reset() {
    this.apmService.all().subscribe(data => {
      this.apartments = data;
      this.createForm();
    }, err => {
      this.alertSevice.error(err);
    });
  }

  search() {
    // tslint:disable-next-line: prefer-const
    let model: any = {};
    model.minPrice = this.priceMinValue;
    model.maxPrice = this.priceMaxValue;
    model.guest = this.guestsValue;
    model.room = this.roomsValue;
    model.city = this.searchForm.get('city').value === null ? null : this.searchForm.get('city').value.name;
    model.country = this.searchForm.get('country').value === null ? null : this.searchForm.get('country').value.name;
    model.dates = this.searchForm.get('dates').value === null ? null : this.parseDate(this.searchForm.get('dates').value);
    console.log(model);
    this.apmService.search(model).subscribe( res => {
      this.apartments = res;
    }, err => {
      this.alertSevice.error(err);
    });
  }

  parseDate(date: string[]) {
    const obj = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04',
      May: '05', Jun: '06', Jul: '07', Aug: '08',
      Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    /*Arr 0*/
    const arr0 = date[0].toString().split(' ');
    const date0 = arr0[2] + '/' + obj[arr0[1]] + '/' + arr0[3];
    /*Arr 1*/
    const arr1 = date[1].toString().split(' ');
    const date1 = arr1[2] + '/' + obj[arr1[1]] + '/' + arr1[3];
    return date0 + '-' + date1;
   }

   show() {
    if (this.authService.decodedToken === null) {
      return false;
    } else {
      if (this.authService.decodedToken.role === 'Host' || this.authService.decodedToken.role === 'Admin' ) {
        return true;
      }
      return false;
    }
  }

}
