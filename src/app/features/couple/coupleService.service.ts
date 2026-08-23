import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoupleServiceService {
  private http = inject(HttpClient);
  private url: string = environment.apiUrl;

  constructor() { }

  postCouple(PairCode: string): Observable<any> {
    return this.http.post<any>(
      `${this.url}/couple`,{
        pairCode: PairCode
      }
    );
  }
  updateCouple(body: any): Observable<any> {
    return this.http.put<any>(
      `${this.url}/couple`, body
    )
  }
}
