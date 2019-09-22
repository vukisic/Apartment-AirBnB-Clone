import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { AmenitiesService } from '../_services/amenities.service';
import { Amenitie } from '../_models/Amenitie';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.css']
})
export class AmenitiesComponent implements OnInit {

  items: Amenitie[] = [];
  addForm: FormGroup = this.formBulider.group({
    name: ['', Validators.required],
  });
  constructor(private authService: AuthService,
              private alertSevice: AlertifyService,
              private amService: AmenitiesService,
              private formBulider: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.getAll();
  }

  createForm() {
    this.addForm = this.formBulider.group({
      name: ['', Validators.required],
    });
  }

  getAll() {
    this.amService.allItems(this.authService.decodedToken.unique_name).subscribe(res => {
      this.items = res;
      this.createForm();
    }, err => {
      this.alertSevice.error('Server Error!');
    });
  }

  add() {
    const name = this.addForm.get('name').value;
    this.amService.add(this.authService.decodedToken.unique_name, name).subscribe(res => {
      this.getAll();
    }, err => {
      this.alertSevice.error('Item Already Exist!');
    });
  }

  remove(name: string) {
    this.amService.remove(this.authService.decodedToken.unique_name, name).subscribe(res => {
      this.getAll();
    }, err => {
      this.alertSevice.error('Server Error!');
    });
  }

}
