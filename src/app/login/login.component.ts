import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from 'angular-toastify';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;
  loading: boolean = false;
  error!: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private _toastService: ToastService
  ) {}

  addInfoToast(error: any) {
    this._toastService.info(error);
  }

  ngOnInit(): void {
    this.checkIfUserLoggedIn();
  }

  checkIfUserLoggedIn() {
    if (localStorage.getItem('flight-departure-user-angular')) {
      this.router.navigate(['home']);
    }
  }

  validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  onChange() {
    this.loading = false;
  }

  onSubmit() {
    const data = {
      email: this.email,
      password: this.password,
    };

    if (!this.email && !this.password) {
      this.error = 'All fields required';
      this.addInfoToast(this.error);
    } else if (!this.validateEmail(this.email)) {
      this.error = 'Enter a valid email';
      this.addInfoToast(this.error);
    } else {
      this.loading = true;

      this.auth
        .loginUser(data)
        .pipe(
          catchError((err) => {
            console.log(err);
            if (err.statusText === 'Unknown Error') {
              this.error = 'Check your internet connnection';
              return of(err);
            } else {
              this.error = 'Server Error';
              return of(err);
            }
          })
        )
        .subscribe((res) => {
          if (this.error) {
            this.addInfoToast(this.error);
          } else if (!res.msg) {
            this.loading = false;
            localStorage.setItem(
              'flight-departure-user-angular',
              JSON.stringify(res.user)
            );
            this.router.navigate(['home']);
          } else {
            this.addInfoToast(res.msg);
          }
        });
    }
  }
}
