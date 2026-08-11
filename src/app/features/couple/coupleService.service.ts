import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoupleServiceService {
private http  =  inject(HttpClient);
  private url: string = "http://localhost:8080/api/v1";
constructor() { }
  getUserProfile(id: string): Observable<any> {
  return this.http.get<any>(
    `${this.url}/couplemember/checkUserId/${id}`
  );
}

}
