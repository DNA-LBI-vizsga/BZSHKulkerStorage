import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private apiUrl = 'http://localhost:3000/leltar'; // Adjust the base URL as needed

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  //User management

  loginUser(userName: string, userPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { userName, userPassword });
  }

  registerUser(userName: string, userPassword: string, isAdmin: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { userName, userPassword, isAdmin });
  }

  changePassword(userName: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/passwordChange`, { userName, newPassword });
  }

  //Storage place management

  getStoragePlaces(): Observable<any> {
    return this.http.get(`${this.apiUrl}/storagePlace`, { headers: this.getAuthHeaders() });
  }

  createStoragePlace(storage: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/storagePlace`, { storage }, { headers: this.getAuthHeaders() });
  }

  deleteStoragePlace(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/storagePlace/${id}`, { headers: this.getAuthHeaders() });
  }

  //Item name management

  getItemNames(): Observable<any> {
    return this.http.get(`${this.apiUrl}/itemName`, { headers: this.getAuthHeaders() });
  }

  createItemName(item: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/itemName`, { item }, { headers: this.getAuthHeaders() });
  }

  deleteItemName(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/itemName/${id}`, { headers: this.getAuthHeaders() });
  }

  updateItemName(id: number, item: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/itemName/${id}`, { item }, { headers: this.getAuthHeaders() });
  }

  //Item management

  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/item`, { headers: this.getAuthHeaders() });
  }

  createItem(itemNameId: number, storagePlaceId: number, description: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/item/${quantity}`, { itemNameId, storagePlaceId, description }, { headers: this.getAuthHeaders() });
  }

  updateItem(id: number, storagePlaceId: number, itemNameId: number, description: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/item/${id}`, { storagePlaceId, itemNameId, description }, { headers: this.getAuthHeaders() });
  }

  deleteItem(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/item/${id}`, {}, { headers: this.getAuthHeaders() });
  }
}