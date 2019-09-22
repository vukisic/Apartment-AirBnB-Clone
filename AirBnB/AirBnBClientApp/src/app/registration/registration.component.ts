import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  model: User;
  registerForm: FormGroup;
  constructor(private authService: AuthService,
              private alertSevice: AlertifyService,
              private formBulider: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.createRegForm();
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password').value === form.get('confirmPassword').value ? null : {missmatch: true};
  }

  createRegForm() {
    this.registerForm = this.formBulider.group({
      gender: ['male'],
      role: ['Guest'],
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});
  }

  register() {
    if (this.registerForm.valid) {
      this.model = Object.assign({}, this.registerForm.value);
      this.authService.register(this.model).subscribe(() => {
        this.alertSevice.success('Registration Successfull!');
      }, err => {
        this.alertSevice.error('Registration Failed!');
      }, () => {
        this.authService.logIn(this.model).subscribe(() => {
          this.router.navigate(['/home']);
        });
      });
    }
  }

}
