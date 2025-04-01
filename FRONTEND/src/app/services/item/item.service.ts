import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/item`, { headers: this.authService.getAuthHeaders() });
  }

  createItem(itemNameId: number, storagePlaceId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/item`, { itemNameId, storagePlaceId, quantity }, { headers: this.authService.getAuthHeaders()  });
  }

  updateItem(itemIdList: number[], newStoragePlaceId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/item`, { itemIdList, newStoragePlaceId }, { headers: this.authService.getAuthHeaders()  });
  }

  deleteItem(itemIdList: number[]): Observable<any> {
    return this.http.delete(`${this.apiUrl}/item`, { headers: this.authService.getAuthHeaders() , body: { itemIdList } });
  }
}
