import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

interface Flight {
  id: string;
  arriving: string;
  time: string;
  airport: string;
  departing: string;
}

const airportAbbreviations: { [key: string]: string } = {
  Brisbane: 'BNE',
  Melbourne: 'MEL',
  Sydney: 'SYD',
  Ballina: 'BNK',
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isLogin = true;
  flights: Flight[] = [];
  loading = true;
  formattedDate!: string;
  time!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkLogin();
    this.fetchFlights();
    this.setDateTime();
  }

  checkLogin() {
    if (!this.isLogin) {
      this.router.navigate(['/login']);
    }
  }

  fetchFlights() {
    if (this.flights.length < 1) {
      axios
        .get('https://opensky-network.org/api/states/all')
        .then((response) => {
          const data = response.data.states;
          const flights: Flight[] = data.map((state: any) => {
            const arrivalAirport = state[2];
            const departureAirport = state[3];
            const time = new Date(state[4] * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              timeZone: 'America/Chicago',
            });
            const id = state[0];
            const arriving =
              airportAbbreviations[arrivalAirport] || arrivalAirport;
            const departing =
              airportAbbreviations[departureAirport] || departureAirport;

            return {
              id: id,
              arriving: arriving,
              time: time,
              airport: `${arriving} `,
              departing: departing,
            };
          });

          this.flights = flights;
          this.loading = false;
        })
        .catch((error) => console.error(error));
    }
  }

  setDateTime() {
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
