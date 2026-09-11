import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeLineService {
  private http = inject(HttpClient);
  private url: string = environment.apiUrl;
  constructor() { }
  getTimeLine(params?: any): Observable<any> {
    return this.http.get<any>(`${this.url}/timelines`,
      {
        params: params
      }
    );
  }
  getTimeLineById(id: string, params?: any): Observable<any> {
    return this.http.get<any>(`${this.url}/timelines/${id}`,
      {
        params: params
      }
    );
  }
  postTimeLine(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/timelines`, data);
  }
  putTimeLine(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/timelines`, data);
  }
  deleteTimeLine(id: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/timelines/${id}`);
  }
}
