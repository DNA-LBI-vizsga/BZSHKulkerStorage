import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemNameService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getItemNames(): Observable<any> {
      return this.http.get(`${this.apiUrl}/itemName`, { headers: this.authService.getAuthHeaders() });
    }
  
  createItemName(item: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/itemName`, { item }, { headers: this.authService.getAuthHeaders() });
  }

  deleteItemName(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/itemName/${id}`, { headers: this.authService.getAuthHeaders() });
  }
}
