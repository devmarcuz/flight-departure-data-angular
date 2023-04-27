import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  data = [
    {
      flight_no: 'QF 2425',
      from: 'Brisbane',
      scheduled: '3:30pm',
      estimated: '3:30pm',
      status: 'Landed',
    },
    {
      flight_no: 'JQ 478',
      from: 'Melbourne',
      scheduled: '3:35pm',
      estimated: '3:35pm',
      status: 'Cancelled',
    },
    {
      flight_no: 'ZL 439',
      from: 'Ballina',
      scheduled: '5:40pm',
      estimated: '4:40pm',
      status: 'On-time',
    },
    {
      flight_no: 'QF 2425',
      from: 'Brisbane',
      scheduled: '5:45pm',
      estimated: '5:40pm',
      status: 'Delayed',
    },
    {
      flight_no: 'QF 2425',
      from: 'Sydney',
      scheduled: '6:00pm',
      estimated: '6:00pm',
      status: 'On-time',
    },
    {
      flight_no: 'JQ 478',
      from: 'Melbourne',
      scheduled: '6:30pm',
      estimated: '6:30pm',
      status: 'Cancelled',
    },
    {
      flight_no: 'ZL 439',
      from: 'Ballina',
      scheduled: '7:05pm',
      estimated: '7:05pm',
      status: 'On-time',
    },
    {
      flight_no: 'QF 2425',
      from: 'Brisbane',
      scheduled: '7:45pm',
      estimated: '7:35pm',
      status: 'On-time',
    },
  ];

  isLogin = true;
  formattedDate!: string;
  time!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkLogin();
    this.setDateTime();
  }

  checkLogin() {
    if (!this.isLogin) {
      this.router.navigate(['/login']);
    }
  }

  setDateTime() {
    const timeOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const locale = navigator.language;
    const date = new Date();
    const day = date.toLocaleDateString(locale, { weekday: 'long' });
    const month = date.toLocaleDateString(locale, { month: 'long' });
    const dayOfMonth = date.getDate();

    this.formattedDate = `${day} ${dayOfMonth} ${month}`;
    let hour = date.getHours();
    let minute = date.getMinutes();
    const ampm = hour >= 12 ? ' PM' : ' AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    minute = minute < 10 ? 0 + minute : minute;
    this.time = hour + ':' + minute + ampm;
  }
}
