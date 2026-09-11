import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileServiceService {
  private http = inject(HttpClient);
  private url: string = environment.apiUrl;
  
  constructor() { }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.url}/users/profile`);
  }

  getPartnerProfile(): Observable<any> {
    return this.http.get<any>(`${this.url}/couple/info`);
  }
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.url}/users/profile`);
  }

}
