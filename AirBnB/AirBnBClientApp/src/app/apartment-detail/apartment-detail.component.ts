import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { AmenitiesService } from '../_services/amenities.service';
import { ApartmentService } from '../_services/apartment.service';
import { FormBuilder } from '@angular/forms';
import { Apartment } from '../_models/Apartment';
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
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddCommentDto } from '../_models/AddCommentDto';
import { CommentStatusDto } from '../_models/CommentStatusDto';

@Component({
  selector: 'app-apartment-detail',
  templateUrl: './apartment-detail.component.html',
  styleUrls: ['./apartment-detail.component.css']
})
export class ApartmentDetailComponent implements OnInit {

  modalRef: BsModalRef;
  apartment: Apartment;
  timeIn: string;
  timeOut: string;
  map: Map;
  markers: any;
  lon = 19.8257506;
  lat = 45.2590193;
  dates: string[];
  name: string;
  commentText = '';
  max = 10;
  rate = 0;
  isReadonly = false;
  overStar: number | undefined;
  percent: number;
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
      this.name = this.apartment.name;
      this.timeIn = this.apartment.timeIn.toString().split('T')[1];
      this.timeOut = this.apartment.timeOut.toString().split('T')[1];
      this.lon = this.apartment.lon;
      this.lat = this.apartment.lat;
      this.name = this.apartment.name;
      this.dates = this.apartment.dates.split(';');
      this.dates.splice(this.dates.length - 1, 1);
      /*this.dates = this.transformDates(this.dates);*/
      this.overStar = void 0;
      this.initialize(this.map, this.reverseGeocode);
      const marker = new Feature({
        geometry: new Point(fromLonLat([this.lon, this.lat]))
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
      });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  changeStatus() {
    this.apmService.changeStatus(this.name).subscribe( res => {
      this.apmService.single(this.name).subscribe(data => {
        this.apartment = data;
      }, err => {
        this.alertSevice.error(err);
      });
    }, err => {
      this.alertSevice.error(err);
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

  reverseGeocode(coords) {
    fetch('http://nominatim.openstreetmap.org/reverse?format=json&lon=' + coords[0] + '&lat=' + coords[1] + '&accept-language=en')
      .then(x => {
             return x.json();
      }).then(json => {
       console.log(json);
       console.log(`
       ${json.address.road}, ${json.address.house_number},
       ${json.address.postcode}, ${json.address.county},
       ${json.address.country}`);
      });
  }

  remove(name: string) {
    this.apmService.remove(name).subscribe( r => {
      this.alertSevice.success('Success!');
      this.router.navigate(['apartments']);
    }, err => {
      this.alertSevice.error(err);
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
         center: fromLonLat([this.lon, this.lat]),
         zoom: 16
       })
     });
   }

   hoveringOver(value: number): void {
    this.overStar = value;
    this.percent = (value / this.max) * 100;
  }

  resetStar(): void {
    this.overStar = void 0;
  }

  addComment() {
    const model: any = {
      apartmentName: this.apartment.name,
      guestUsername: this.authService.decodedToken.unique_name,
      text: this.commentText,
      rating: this.rate
    };

    const comment: AddCommentDto = Object.assign({}, model);
    this.apmService.addComment(comment).subscribe( res => {
      this.alertSevice.success('Success!');
    }, err => {
      this.alertSevice.message('Error!');
    });
  }

  showForGuest() {
    if (this.authService.decodedToken === null) {
      return false;
    } else {
      if (this.authService.decodedToken.role === 'Guest' ) {
        return true;
      }
      return false;
    }
  }

  showForHost() {
    if (this.authService.decodedToken === null) {
      return false;
    } else {
      if (this.authService.decodedToken.role === 'Host' ) {
        return true;
      }
      return false;
    }
  }

  showForHostAndAdmin() {
    if (this.authService.decodedToken === null) {
      return false;
    } else {
      if (this.authService.decodedToken.role === 'Host' || this.authService.decodedToken.role === 'Admin' ) {
        return true;
      }
      return false;
    }
  }

  changeComStatus(id: number) {
    const model: any = {
      // tslint:disable-next-line: object-literal-shorthand
      id: id,
      name: this.apartment.name
    };
    const dto: CommentStatusDto = Object.assign({}, model);
    this.apmService.changeCommentStatus(dto).subscribe( res => {
      this.apmService.single(this.name).subscribe(data => {
        this.apartment = data;
      }, err => {
        this.alertSevice.error(err);
      });
    }, er => {
      this.alertSevice.message('Error');
    });
  }

}
