import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private airportAbbreviations: { [key: string]: string } = {
    Brisbane: 'BNE',
    Melbourne: 'MEL',
    Sydney: 'SYD',
    Ballina: 'BNK',
  };

  constructor(private http: HttpClient) {}

  fetchFlights(): Observable<any> {
    return this.http.get<any>('https://opensky-network.org/api/states/all');
  }
}
