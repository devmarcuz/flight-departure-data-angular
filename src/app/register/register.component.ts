import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  username!: string;
  email!: string;
  password!: string;
  confirmPassword!: string;
  error!: string;
  loading: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private _toastService: ToastService
  ) {}

  addInfoToast(error: any) {
    console.log(error);
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

  onClick() {
    const data = {
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    if (
      !this.username &&
      !this.email &&
      !this.confirmPassword &&
      !this.password
    ) {
      this.error = 'All fields required';
      this.addInfoToast(this.error);
    } else if (this.username.length < 3) {
      this.error = 'Username length too short';
      this.addInfoToast(this.error);
    } else if (this.password.length < 8) {
      this.error = 'Password length too short';
      this.addInfoToast(this.error);
    } else if (!this.validateEmail(this.email)) {
      this.error = 'Enter a valid email';
      this.addInfoToast(this.error);
    } else if (this.password !== this.confirmPassword) {
      this.error = "Password doesn't match";
      this.addInfoToast(this.error);
    } else {
      this.loading = true;

      this.auth
        .registerUser(data)
        .pipe(
          catchError((err) => {
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
