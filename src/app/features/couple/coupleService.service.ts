import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoupleServiceService {
  private http = inject(HttpClient);
  private url: string = environment.apiUrl;
  private invitationSignal = signal<boolean>(false);

  invitation = this.invitationSignal.asReadonly();
  constructor() { }

  postCouple(body: any): Observable<any> {
    return this.http.post<any>(
      `${this.url}/couple-invitations/invitations`,body
    );
  }
  updateCouple(body: any): Observable<any> {
    return this.http.put<any>(
      `${this.url}/couple`, body
    )
  }
  getAllInvatation(params: any): Observable<any> {
    return this.http.get<any>(
      `${this.url}/couple-invitations`,{params:params}
    )
  }
  updateStatusInvitation(body: any): Observable<any> {
    return this.http.post<any>(
      `${this.url}/couple-invitations/invitations/status`,body)
  }
  getCurrentValue(): boolean {
    return this.invitationSignal();
  }

  setValue(value: boolean): void {
    this.invitationSignal.set(value);
  }

}
