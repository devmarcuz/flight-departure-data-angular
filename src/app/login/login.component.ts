import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';

  constructor(private router: Router) {}

  onSubmit(event: any): void {
    event.preventDefault();
    this.router.navigate(['home']);
  }
}
