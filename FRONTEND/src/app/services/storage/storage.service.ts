import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private authService: AuthService) {}

  getStoragePlaces(): Observable<any> {
      return this.http.get(`${this.apiUrl}/storagePlace`, { headers: this.authService.getAuthHeaders() });
    }
  
  createStoragePlace(storage: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/storagePlace`, { storage }, { headers: this.authService.getAuthHeaders() });
  }

  deleteStoragePlace(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/storagePlace/${id}`, { headers: this.authService.getAuthHeaders() });
  }
}
