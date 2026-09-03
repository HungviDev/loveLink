import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/auth';

  getRefreshToken(): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/refresh`, {},{
    withCredentials: true
  });
}
  
}
