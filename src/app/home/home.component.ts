import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlaneUp, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { Flight } from '../Flight';
import { FlightService } from '../services/flight.service';

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
  flights: Flight[] = [];
  loading = true;
  formattedDate!: string;
  time!: string;
  currentPage: number = 1;
  postsPerPage: number = 8;
  indexOfLastPost = this.currentPage * this.postsPerPage;
  indexOfFirstPost = this.indexOfLastPost - this.postsPerPage;
  currentPosts: Flight[] = [];
  faPlaneUp = faPlaneUp;
  faPowerOff = faPowerOff;

  constructor(private router: Router, private flightApi: FlightService) {}

  ngOnInit(): void {
    this.checkIfLogin();
    this.fetchFlights();
    this.setDateTime();
    if (this.flights.length > 1) {
      this.setCurrentPosts();
    }
  }

  checkIfLogin() {
    if (!localStorage.getItem('flight-departure-user-angular')) {
      this.router.navigate(['login']);
    }
  }

  assign() {
    this.indexOfLastPost = this.currentPage * this.postsPerPage;
    this.indexOfFirstPost = this.indexOfLastPost - this.postsPerPage;
    this.setCurrentPosts();
  }

  setCurrentPosts() {
    this.currentPosts = [
      ...this.flights.slice(this.indexOfFirstPost, this.indexOfLastPost),
    ];
  }

  paginate = (number: number) => {
    this.assign();
    this.currentPage = number;
  };

  fetchFlights() {
    if (this.flights.length < 1) {
      this.flightApi.fetchFlights().subscribe((response) => {
        const data = response.states;
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
        this.totalPosts = this.flights.length;
        this.setCurrentPosts();
      });
    }
  }

  totalPosts: number = this.flights.length;

  logout = () => {
    localStorage.clear();
    this.router.navigate(['login']);
  };

  setDateTime() {
    const locale = navigator.language;
    const date = new Date();
    const day = date.toLocaleDateString(locale, { weekday: 'long' });
    const month = date.toLocaleDateString(locale, { month: 'long' });
    const dayOfMonth = date.getDate();

    this.time = new Date().toLocaleTimeString(navigator.language, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    this.formattedDate = `${day} ${dayOfMonth} ${month}`;
  }
}
