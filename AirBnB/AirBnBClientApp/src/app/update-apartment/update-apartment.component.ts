import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { AmenitiesService } from '../_services/amenities.service';
import { ApartmentService } from '../_services/apartment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apartment } from '../_models/Apartment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/ngx-bootstrap-datepicker';
import { Amenitie } from '../_models/Amenitie';
import { ApartmentUpdate } from '../_models/ApartmentUpdate';
import { Time } from '@angular/common';

@Component({
  selector: 'app-update-apartment',
  templateUrl: './update-apartment.component.html',
  styleUrls: ['./update-apartment.component.css']
})
export class UpdateApartmentComponent implements OnInit {
  modalRef: BsModalRef;
  apartment: Apartment;
  form: FormGroup = this.formBulider.group({
    type: ['Whole'],
    price: [null, Validators.required],
    rooms: [null, Validators.required],
    guests: ['', Validators.required],
    amenities: [[], Validators.required],
    timeIn: [null, Validators.required],
    timeOut: [null, Validators.required],
    dates: [Date[0], Validators.required]
  });

  colorTheme = 'theme-green';
  bsConfig: Partial<BsDatepickerConfig>;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  status: string;
  items: Amenitie[] = [];
  model: any = new Object();
  timeIn: string;
  constructor(private route: ActivatedRoute,
              public authService: AuthService,
              private alertSevice: AlertifyService,
              private amService: AmenitiesService,
              private apmService: ApartmentService,
              private formBulider: FormBuilder,
              private router: Router,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.apartment = data.apm;
      this.createForm();
      this.selectDates();
      this.amService.allItems(this.authService.decodedToken.unique_name).subscribe (res => {
        this.items = res;
      }, er => {
        this.alertSevice.error(er);
      });
    }, err => {
      this.alertSevice.error(err);
    });
  }

  selectDates() {
    const dates = this.apartment.dates.split(';');
    dates.splice(dates.length - 1, 1);
    // tslint:disable-next-line: radix
    const dateStart = new Date(parseInt(dates[0].split('/')[2]), parseInt(dates[0].split('/')[0]) - 1, parseInt(dates[0].split('/')[1]));
    const lastIndex = dates.length - 1;
    // tslint:disable-next-line: radix
    const dateEnd = new Date(parseInt(dates[lastIndex].split('/')[2]),
                             // tslint:disable-next-line: radix
                             parseInt(dates[lastIndex].split('/')[0]) - 1,
                             // tslint:disable-next-line: radix
                             parseInt(dates[lastIndex].split('/')[1]));
    this.bsRangeValue = [dateStart, dateEnd];
    return [dateStart, dateEnd];
  }

  createForm() {
    this.form = this.formBulider.group({
    type: [this.apartment.type],
    price: [this.apartment.price, Validators.required],
    rooms: [this.apartment.rooms, Validators.required],
    guests: [this.apartment.guests, Validators.required],
    amenities: [this.apartment.amenities, Validators.required],
    timeIn: [this.apartment.timeIn.toString().split('T')[1], Validators.required],
    timeOut: [this.apartment.timeOut.toString().split('T')[1], Validators.required],
    dates: [this.selectDates(), Validators.required]
    });
  }

  update() {
    this.makeDate(this.apartment.dates);
    this.model.guests = this.form.get('guests').value;
    this.model.rooms = this.form.get('rooms').value;
    this.model.price = this.form.get('price').value;
    this.model.type = this.form.get('type').value;
    this.model.timeIn = this.form.get('timeIn').value;
    this.model.timeOut = this.form.get('timeOut').value;
    this.model.name = this.apartment.name;
    if (this.makeDate(this.apartment.dates) !== this.parseDate(this.form.get('dates').value)) {
      this.model.datesUpdate = true;
      this.model.dates = this.parseDate(this.form.get('dates').value);
    } else {
      this.model.datesUpdate = false;
      this.model.dates = this.apartment.dates;
    }
    this.model.dates = this.parseDate(this.form.get('dates').value);
    this.model.amenities = this.form.get('amenities').value;
    const apm: ApartmentUpdate = Object.assign({}, this.model);
    this.apmService.update(this.apartment.name, apm).subscribe( res => {
      this.alertSevice.success('Success');
      this.router.navigate(['apartment', this.apartment.name]);
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

   makeDate(dates: string) {
    const arr = dates.split(';');
    let first = arr[0];
    let last = arr[arr.length - 2];
    first = first.split('/')[1] + '/' + this.convertToNumStr(first.split('/')[0]) + '/' + first.split('/')[2];
    last = last.split('/')[1] + '/' + this.convertToNumStr(last.split('/')[0]) + '/' + last.split('/')[2];
    const res = first + '-' + last;
    return res;
   }

   convertToNumStr(str: string) {
     // tslint:disable-next-line: radix
     const val = parseInt(str);
     if (val < 10) {
       return '0' + str;
     } else {
       return str;
     }
   }

}
