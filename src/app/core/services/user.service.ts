import { Injectable, signal, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private authService = inject(AuthService);
  profile = signal<User | null>(this.authService.currentUser());

  updateProfile(data: Partial<User>): Observable<User> {
    const current = this.profile();
    const updated: User = {
      ...(current || {
        id: 'u-101',
        email: 'alex@example.com',
        fullName: 'Alex Vance',
        createdAt: new Date().toISOString()
      }),
      ...data
    };
    this.profile.set(updated);
    return of(updated).pipe(delay(500));
  }
}
