import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFeatureService } from '../services/auth-feature.service';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { User } from '../../../core/models/user.model';
import { CacheServiceService } from '../../../core/services/CacheService.service';
import { AuthKeys } from '../../../core/models/auth-keys.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private authFeatureService = inject(AuthFeatureService);
  private router = inject(Router);
  private cacheService  =  inject(CacheServiceService);
  private message = inject(NzMessageService);
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
      next: (res: any) => {
        this.loading.set(false);
        if(res.status === 200){
          this.user.set(res.user);
          this.router.navigate(['/dashboard']);
          this.cacheService.setCache(AuthKeys.TOKEN, res.data);
          this.message.success('Đăng nhập thành công!');
        }
        else{
          this.message.error(res.message);
        }
      },
      error: (err: any) => {
        console.error(err);
        const errorMsg = err?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
        this.error.set(errorMsg);
        this.message.error(errorMsg);
        this.loading.set(false);
      }
    });
  }

  register(payload: RegisterRequest): void {
    this.loading.set(true);
    this.error.set(null);
    this.authFeatureService.register(payload).subscribe({
      next: (res: any) => {
        if(res.status === 200){
          this.user.set(res.user);
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
        this.message.success('Đăng ký thành công!');
        }
        else{
          this.message.error(res.message);
        }
        
      },
      error: (err) => {
        const errorMsg = err?.message || 'Đăng ký thất bại.';
        this.error.set(errorMsg);
        this.message.error(errorMsg);
        this.loading.set(false);
      }
    });
  }
}
