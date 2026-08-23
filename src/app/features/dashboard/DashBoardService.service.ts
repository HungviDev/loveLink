import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DaiylyMood } from './pages/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class DashBoardServiceService {
  private http = inject(HttpClient);
  private url: string = environment.apiUrl;
  constructor() { }
  getInforCouple(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/couple/info`
    );
  }
  getProfileUser(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/users/profile`
    );
  }
  getDailyMood(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/daily-moods`
    );
  }
  getDashBoard(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/couple/dashboard`
    );
  }
  getAblum(paramss?: any): Observable<any> {
    return this.http.get<any>(
      `${this.url}/album`,
      { params : paramss}
    );
  }
  postNoteDailyMood(body: DaiylyMood): Observable<any> {
    return this.http.post<any>(
      `${this.url}/daily-moods`, body
    )
  }
  getEventUpcomming(){
    return this.http.get<any>(
      `${this.url}/events/upcoming`
    )
  }
  updateUser(body: any): Observable<any> {
    return this.http.put<any>(
      `${this.url}/users`, body
    )
  }
}
