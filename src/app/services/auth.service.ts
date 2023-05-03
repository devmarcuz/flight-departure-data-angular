import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://flight-departure-auth-api.onrender.com/api/auth';

  constructor(private http: HttpClient) {}

  loginUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login-user`, data, httpOptions);
  }

  registerUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-user`, data, httpOptions);
  }
}
