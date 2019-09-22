import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  editForm: FormGroup = this.formBulider.group({
    gender: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    confirmPassword: ['', Validators.required]
  }, {validators: this.passwordMatchValidator});
  currentUser: any;
  model: any = new Object();
  constructor(private authService: AuthService,
              private alertSevice: AlertifyService,
              private userService: UserService,
              private formBulider: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.authService.checkForToken();
    this.userService.getUser(this.authService.decodedToken.unique_name).subscribe( res => {
      res.gender = res.gender.toLowerCase();
      this.currentUser = res;
      this.createRegForm();
    }, err => {
      this.alertSevice.error('Server Error!');
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password').value === form.get('confirmPassword').value ? null : {missmatch: true};
  }

  createRegForm() {
    this.editForm = this.formBulider.group({
      gender: [this.currentUser.gender],
      firstName: [this.currentUser.firstName, Validators.required],
      lastName: [this.currentUser.lastName, Validators.required],
      password: ['', [Validators.minLength(4), Validators.maxLength(20)]],
      confirmPassword: ['']
    }, {validators: this.passwordMatchValidator});
  }

  edit() {
    if (this.editForm.valid) {
      this.model.username = this.authService.decodedToken.unique_name;
      this.model.firstName = this.editForm.get('firstName').value;
      this.model.lastName = this.editForm.get('lastName').value;
      this.model.gender = this.editForm.get('gender').value;
      if (this.editForm.get('password').value !== '') {
        this.model.password = this.editForm.get('password').value;
      }
      this.userService.updateUser(this.model).subscribe( res => {
        this.alertSevice.success('Updated!');
        this.router.navigate(['home']);
      }, err => {
        this.alertSevice.error('Failed to Update!');
      });
    }
  }

}
