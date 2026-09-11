import { ApiService } from './../services/api.service';
import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CacheServiceService } from '../services/CacheService.service';
import { AuthKeys } from '../models/auth-keys.model';
import { catchError, switchMap, throwError } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheServiceService);
  const apiService = inject(ApiService);
  const token = cacheService.getCache(AuthKeys.TOKEN);
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Chỉ set Content-Type là application/json khi request có body và body không phải FormData
  if (req.body !== null && !(req.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  req = req.clone({ setHeaders: headers });

   return next(req).pipe(
    catchError(error => {
      if (error.status === 400) {
        console.log('Request không hợp lệ');
      }
      
      // Kiểm tra 401 và ngăn chặn vòng lặp vô tận nếu api refresh cũng bị 401
      if (error.status === 401 && !req.url.includes('/api/auth/refresh')) {
      return apiService.getRefreshToken().pipe(
        switchMap((res: any) => {
          if (res.status === 200) {
            cacheService.setCache(AuthKeys.TOKEN, res.data);
            const newReq = req.clone({ 
              setHeaders: { 'Authorization': `Bearer ${res.data}` } 
            });
            return next(newReq); 
          }
          return throwError(() => error);
        }),
        catchError((err) => {
          console.log('Lỗi 401 khi lấy token mới hoặc refresh token hết hạn', err);
          // Chỗ này thường sẽ điều hướng user về trang Login
          return throwError(() => err);
        })
      );
    }
      
      if (error.status >= 500) {
        console.log('Lỗi server');
      }
      return throwError(() => error);
    })
  );
};
