import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheServiceService {
  

constructor() { }
  setCache(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getCache(key: string) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  removeCache(key: string) {
    localStorage.removeItem(key);
  }
  

}
