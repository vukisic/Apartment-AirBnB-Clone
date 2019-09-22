import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public users: User[];
  searchForm: FormGroup;
  constructor(private authService: AuthService,
              private alertService: AlertifyService,
              private userService: UserService,
              private formBulider: FormBuilder) { }

  ngOnInit() {
    this.getUsers();
    this.createForm();
  }

  createForm() {
    this.searchForm = this.formBulider.group({
      role: ['All'],
      gender: ['All'],
      username: ['']
    });
  }

  getUsers() {
    this.userService.allUsers(this.authService.decodedToken.unique_name).subscribe(res => {
      this.users = res;
    }, err => {
      this.alertService.error(err);
    });
  }

  block(username: string) {
    this.userService.block(username).subscribe(res => {
      this.alertService.success('Success!');
      this.getUsers();
    }, err => {
      this.alertService.error('Failed!');
    });
  }

  unblock(username: string) {
    this.userService.unblock(username).subscribe(res => {
      this.alertService.success('Success!');
      this.getUsers();
    }, err => {
      this.alertService.error('Failed!');
    });
  }

  search() {
    this.userService.allUsers(this.authService.decodedToken.unique_name).subscribe(res => {
      this.users = res;
      let usersArr: User[] = this.users;
      const username = this.searchForm.get('username').value;
      const role = this.searchForm.get('role').value;
      const gender = this.searchForm.get('gender').value;
      if (username === '' && role === 'All' && gender === 'All') {
        this.getUsers();
        return;
      } else {
        if (username !== '') {
          usersArr = this.filterUsername(username, usersArr);
        }

        if (role !== 'All') {
          usersArr = this.filterRole(role, usersArr);
        }

        if (gender !== 'All') {
          usersArr = this.filterGender(gender, usersArr);
        }

        this.users = usersArr;
      }
    }, err => {
      this.alertService.error(err);
    });
  }

  filterUsername(username: string, arr: User[]): User[] {
    const usersArr: User[] = [];
    // tslint:disable-next-line: prefer-const
    for (let user of arr) {
      if (user.username.indexOf(username) !== -1) {
        usersArr.push(user);
      }
    }
    return usersArr;
  }

  filterRole(role: string, arr: User[]): User[] {
    const usersArr: User[] = [];
    // tslint:disable-next-line: prefer-const
    for (let user of arr) {
      if (user.role === role) {
        usersArr.push(user);
      }
    }
    return usersArr;
  }

  filterGender(gender: string, arr: User[]): User[] {
    const usersArr: User[] = [];
    // tslint:disable-next-line: prefer-const
    for (let user of arr) {
      if (user.gender === gender) {
        usersArr.push(user);
      }
    }
    return usersArr;
  }

  reset() {
    this.getUsers();
    this.createForm();
  }

  handleBackspace() {
    this.search();
  }
}
