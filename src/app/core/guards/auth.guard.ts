import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CacheServiceService } from '../services/CacheService.service';
import { AuthKeys } from '../models/auth-keys.model';

export const authGuard: CanActivateFn = (route, state) => {
  const cacheService = inject(CacheServiceService);
  const router = inject(Router);
  const token = cacheService.getCache(AuthKeys.TOKEN);

  if (token) {
    if (state.url.includes('/auth/login') || state.url.includes('/auth/register')) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  } else {
    if (state.url.includes('/auth/login') || state.url.includes('/auth/register')) {
       return true;
    }
    router.navigate(['/auth/login']);
    return false;
  }
}; 
