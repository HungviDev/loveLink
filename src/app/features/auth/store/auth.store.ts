import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFeatureService } from '../services/auth-feature.service';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { User } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private authFeatureService = inject(AuthFeatureService);
  private router = inject(Router);

  // State signals
  user = signal<User | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed signals
  isAuthenticated = computed(() => !!this.user());
  hasPartner = computed(() => !!this.user()?.partnerId);

  login(credentials: LoginRequest): void {
    this.loading.set(true);
    this.error.set(null);

    this.authFeatureService.login(credentials).subscribe({
      next: (res) => {
        this.user.set(res.user);
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err?.message || 'Login failed. Please check your credentials.');
        this.loading.set(false);
      }
    });
  }

  register(payload: RegisterRequest): void {
    this.loading.set(true);
    this.error.set(null);

    this.authFeatureService.register(payload).subscribe({
      next: (res) => {
        this.user.set(res.user);
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err?.message || 'Registration failed.');
        this.loading.set(false);
      }
    });
  }
}
