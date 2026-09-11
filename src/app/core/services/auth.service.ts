import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user.model';
import { LoginRequest, RegisterRequest } from '../../features/auth/models/auth.model';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { CacheServiceService } from './CacheService.service';
import { AuthKeys } from '../models/auth-keys.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'lovelink_token';
  private readonly USER_KEY = 'lovelink_user';
  private readonly PAIRED_KEY = 'lovelink_paired';
  private http = inject(HttpClient);
  private cacheService = inject(CacheServiceService);
  private url: string = environment.apiUrl;


  constructor(
  ){
  }
  private defaultUser: User = {
    id: 'u-101',
    email: 'alex@example.com',
    fullName: 'Alex Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    partnerId: 'u-102',
    partnerName: 'Sophia Miller',
    partnerAvatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    relationshipStartDate: '2023-02-14',
    createdAt: new Date().toISOString()
  };

  currentUser = signal<User>(this.getStoredUser() || this.defaultUser);
  token = signal<string | null>(this.getStoredToken() || 'mock-dev-token');
  isPaired = signal<boolean>(this.getStoredPairedState());
  myPairCode = signal<string>('LOVE68');
  private baseUrl = 'http://localhost:8080/api';

  login(credentials: LoginRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(
    `${this.baseUrl}/auth/login`,
    credentials
  );
}

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/auth/register`,
      payload
    );
  }

  verifyPairCode(code: string): Observable<boolean> {
    const cleanCode = code.trim().toUpperCase();
    const validCodes = ['LOVE68', 'LOVE2025', '5201314', '123456'];
    
    // Accept valid code or any 6+ alphanumeric code for smooth testing
    const isValid = validCodes.includes(cleanCode) || cleanCode.length >= 4;

    if (isValid) {
      this.setPairedState(true);
      return of(true).pipe(delay(600));
    } else {
      return throwError(() => new Error('Mã kết nối không hợp lệ. Vui lòng thử lại!'));
    }
  }

  setPairedState(paired: boolean): void {
    localStorage.setItem(this.PAIRED_KEY, JSON.stringify(paired));
    this.isPaired.set(paired);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.PAIRED_KEY);
    this.currentUser.set(this.defaultUser);
    this.token.set(null);
    this.isPaired.set(false);
  }

   getUser() : any{
    const jwt = this.cacheService.getCache(AuthKeys.TOKEN);
    if (!jwt) {
      return null;
    }
    const user = jwtDecode(jwt);
    return user;
  }



  private setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.token.set(token);
    this.currentUser.set(user);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  private getStoredPairedState(): boolean {
    const data = localStorage.getItem(this.PAIRED_KEY);
    return data !== null ? JSON.parse(data) : false; // Default to false to trigger onboarding dialog!
  }


  
}
