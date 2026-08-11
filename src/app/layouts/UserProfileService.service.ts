import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileServiceService {
  private http  =  inject(HttpClient);
  private url: string = "http://localhost:8080/api/v1";
constructor() { }
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.url}/users/profile`);
  }
}
