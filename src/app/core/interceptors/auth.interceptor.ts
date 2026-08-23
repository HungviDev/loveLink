import { ApiService } from './../services/api.service';
import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CacheServiceService } from '../services/CacheService.service';
import { AuthKeys } from '../models/auth-keys.model';
import { catchError, throwError } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cacheService = inject(CacheServiceService);
  const apiService = inject(ApiService);
  const token = cacheService.getCache(AuthKeys.TOKEN);
  const headers: Record<string, string> = {};
  if(token){
    headers['Authorization'] = `Bearer ${token}`;
  }
  if(!(req.body  instanceof FormData)){
    headers['Content-Type'] = 'application/json';
  }
  req = req.clone({ setHeaders: headers });

   return next(req).pipe(
    catchError(error => {
      if (error.status === 400) {
        console.log('Request không hợp lệ');
      }
      if (error.status === 401) {
        apiService.getRefreshToken().subscribe({
          next: (res) => {
            if(res.status === 200){
              cacheService.setCache(AuthKeys.TOKEN, res.data);
              req = req.clone({ setHeaders: { 'Authorization': `Bearer ${res.data}` } });
            }
          }
          , error: (err) => {
            console.log('Lỗi 401 khi lấy token mới',  err);
          }
        })
      }
      
      if (error.status >= 500) {
        console.log('Lỗi server');
      }
      return throwError(() => error);
    })
  );
};
