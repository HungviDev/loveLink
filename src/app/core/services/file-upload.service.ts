import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private http = inject(HttpClient);
  
  // Bạn có thể dùng trực tiếp URL cứng hoặc sử dụng environment (khuyến khích)
  // Nếu dùng cứng: private uploadUrl = 'http://localhost:8080/api/v1/files/upload';
  private uploadUrl = `${environment.apiUrl}/files/upload`;

  constructor() { }

  /**
   * Upload 1 file
   * @param file File cần upload
   * @returns Observable chứa thông tin response từ server
   */
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); 
    return this.http.post<any>(this.uploadUrl, formData);
  }

  /**
   * Upload nhiều file cùng lúc (Nâng cao nếu backend hỗ trợ)
   * @param files Danh sách file cần upload
   * @returns Observable
   */
  uploadMultipleFiles(files: File[]): Observable<any> {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file); 
    });
    return this.http.post<any>(`${environment.apiUrl}/files/upload-multiple`, formData);
  }
}
