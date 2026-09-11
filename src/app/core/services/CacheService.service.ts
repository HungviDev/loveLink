import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheServiceService {
  

constructor() { }
  setCache(key: string, value: any) {
    const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, valueToStore);
  }

  getCache(key: string) {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (error) {
      // Nếu parse lỗi -> nó là chuỗi bình thường (như token)
      return value;
    }
  }

  removeCache(key: string) {
    localStorage.removeItem(key);
  }
  

}
