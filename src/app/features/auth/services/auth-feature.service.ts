import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { AuthResponse } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthFeatureService {
  private authService = inject(AuthService);

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.authService.login(credentials);
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.authService.register(payload);
  }
}
