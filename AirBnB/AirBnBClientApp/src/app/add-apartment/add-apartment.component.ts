import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { AmenitiesService } from '../_services/amenities.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApartmentService } from '../_services/apartment.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/ngx-bootstrap-datepicker';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj.js';
import {toLonLat} from 'ol/proj.js';
import {transform} from 'ol/proj.js';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import sVector from 'ol/source/Vector';
import lVector from 'ol/layer/Vector';
import { FileUploader } from 'ng2-file-upload';
import { Amenitie } from '../_models/Amenitie';
import { AddApartment } from '../_models/AddApartment';
import { Photo } from '../_models/Photo';

@Component({
  selector: 'app-add-apartment',
  templateUrl: './add-apartment.component.html',
  styleUrls: ['./add-apartment.component.css']
})
export class AddApartmentComponent implements OnInit {

  form: FormGroup = this.formBulider.group({
    type: ['Whole'],
    name: ['', Validators.required],
    price: [null, Validators.required],
    rooms: [null, Validators.required],
    lon: [null, Validators.required],
    lat: [null, Validators.required],
    guests: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    street: ['', Validators.required],
    number: ['', Validators.required],
    postCode: ['', Validators.required],
    photos: [null],
    amenities: [],
    timeIn: [null, Validators.required],
    timeOut: [null, Validators.required],
    dates: [Date[0], Validators.required]
  });
  colorTheme = 'theme-green';
  bsConfig: Partial<BsDatepickerConfig>;
  map: Map;
  markers: any;
  country: string;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  status: string;
  photos: Photo[];
  items: Amenitie[] = [];
  model: any = new Object();
  constructor(public authService: AuthService,
              private alertSevice: AlertifyService,
              private amService: AmenitiesService,
              private apmService: ApartmentService,
              private formBulider: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.amService.allItems(this.authService.decodedToken.unique_name).subscribe(res => {
      this.items = res;
      this.createForm();
      this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
      this.initialize(this.map, this.reverseGeocode);
      this.initializeUploader();
    }, err => {
      this.alertSevice.error('Server Error!');
    });
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.photos = [];
    this.uploader = new FileUploader({
      url: 'https://localhost:44371/api/apartments/photos',
      authToken: 'Bearer ' +  localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        this.photos.push(res);
      }
    };

    this.uploader.onCompleteAll = () => {
      this.status = 'Complete!';
    };

    this.uploader.onErrorItem = (item, response, status, headers) => {
      console.log(item);
      console.log(response);
      console.log(status);
      console.log(headers);
    };
  }

  createForm() {
    this.form = this.formBulider.group({
      type: ['Whole'],
    name: ['', Validators.required],
    price: [null, Validators.required],
    rooms: [null, Validators.required],
    lon: [null, Validators.required],
    lat: [null, Validators.required],
    guests: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    street: ['', Validators.required],
    number: ['', Validators.required],
    postCode: ['', Validators.required],
    photos: [null],
    amenities: [],
    timeIn: [null, Validators.required],
    timeOut: [null, Validators.required],
    dates: [Date[0], Validators.required]
    });
  }

  initialize(map, fun) {
    this.map = new Map({
       target: 'map',
       layers: [
         new Tile({
           source: new OSM()
         })
       ],
       view: new View({
         center: fromLonLat([19.833549, 45.267136]),
         zoom: 14
       })
     });

    this.map.on('click', evt => {
     // tslint:disable-next-line: no-string-literal
     const lonlat = transform(evt['coordinate'], 'EPSG:3857', 'EPSG:4326');
     const lon = lonlat[0];
     const lat = lonlat[1];
     // tslint:disable-next-line: no-string-literal
     const coord = toLonLat(evt['coordinate']);
     if (confirm('Sure?')) {
         this.reverseGeocode(coord);
         const marker = new Feature({
           geometry: new Point(fromLonLat(lonlat))
         });
         const vectorSource = new sVector({
           features: [marker]
         });
         const markerVectorLayer = new lVector({
           source: vectorSource,
         });
         // tslint:disable-next-line: no-string-literal
         this.map['layers'] = [];
         this.map.addLayer(markerVectorLayer);
       }
     });
   }

   reverseGeocode(coords) {
    fetch('http://nominatim.openstreetmap.org/reverse?format=json&lon=' + coords[0] + '&lat=' + coords[1] + '&accept-language=en')
       .then(x => {
              return x.json();
       }).then(json => {
        console.log(json);
        this.form.get('country').setValue(json.address.country);
        this.form.get('city').setValue(json.address.county);
        this.form.get('street').setValue(json.address.road);
        this.form.get('number').setValue(json.address.house_number);
        this.form.get('lon').setValue(json.lon);
        this.form.get('lat').setValue(json.lat);
        this.form.get('postCode').setValue(json.address.postcode);
       });
   }

   add() {
    this.model.city = this.form.get('city').value;
    this.model.country =  this.form.get('country').value;
    this.model.street =  this.form.get('street').value;
    this.model.number =  this.form.get('number').value;
    this.model.postCode =  this.form.get('postCode').value;
    this.model.lat =  this.form.get('lat').value;
    this.model.lon =  this.form.get('lon').value;
    this.model.name = this.form.get('name').value;
    this.model.guests = this.form.get('guests').value;
    this.model.rooms = this.form.get('rooms').value;
    this.model.price = this.form.get('price').value;
    this.model.type = this.form.get('type').value;
    this.model.timeIn = this.form.get('timeIn').value;
    this.model.timeOut = this.form.get('timeOut').value;
    this.model.hostUsername = this.authService.decodedToken.unique_name;
    this.model.dates = this.parseDate(this.form.get('dates').value);
    this.model.amenities = this.form.get('amenities').value;
    this.model.photos = this.photos;
    const apm: AddApartment = Object.assign({}, this.model);
    this.apmService.add(apm).subscribe( res => {
      this.alertSevice.success('Added!');
      this.router.navigate(['apartments']);
    }, err => {
      this.alertSevice.error(err);
    });
   }

   formValid() {
    if (this.form.valid && this.photos.length > 0 &&
      this.form.get('amenities').value !== null && this.form.get('amenities').value.length > 0 ) {
      return true;
    }
    return false;
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

}
