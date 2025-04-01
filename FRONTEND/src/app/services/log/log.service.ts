import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private authService: AuthService) {}

  downloadLogs(filters: { itemNameId?: number; storagePlaceId?: number; createdBy?: number; fromDate?: string; toDate?: string }): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/log`, filters, { 
      headers: this.authService.getAuthHeaders(), 
      responseType: 'blob' 
    });
  }
}
