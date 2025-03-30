import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() });
  }

  disableUser(userEmail: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/disable`, { userEmail },{ headers: this.getAuthHeaders() });
  }
  enableUser(userEmail: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/enable`, { userEmail }, { headers: this.getAuthHeaders() });
  }
  
  promoteUser(userEmail: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/promote`, { userEmail }, { headers: this.getAuthHeaders() });
  }
  
  demoteUser(userEmail: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/demote`, { userEmail }, { headers: this.getAuthHeaders() });
  }

  // User management

  loginUser(userEmail: string, userPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { userEmail, userPassword });
  }

  firstLogin(userPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/firstLogin`, { userPassword }, { headers: this.getAuthHeaders() });
  }

  passwordChange(userEmail: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/passwordChange`, { userEmail });
  }

  registerUser(userEmail: string, isAdmin: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { userEmail,  isAdmin }, { headers: this.getAuthHeaders() });
  }

  // Storage place management

  getStoragePlaces(): Observable<any> {
    return this.http.get(`${this.apiUrl}/storagePlace`, { headers: this.getAuthHeaders() });
  }

  createStoragePlace(storage: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/storagePlace`, { storage }, { headers: this.getAuthHeaders() });
  }

  deleteStoragePlace(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/storagePlace/${id}`, { headers: this.getAuthHeaders() });
  }

  // Item name management

  getItemNames(): Observable<any> {
    return this.http.get(`${this.apiUrl}/itemName`, { headers: this.getAuthHeaders() });
  }

  createItemName(item: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/itemName`, { item }, { headers: this.getAuthHeaders() });
  }

  deleteItemName(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/itemName/${id}`, { headers: this.getAuthHeaders() });
  }

  // Item management

  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/item`, { headers: this.getAuthHeaders() });
  }

  createItem(itemNameId: number, storagePlaceId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/item`, { itemNameId, storagePlaceId, quantity }, { headers: this.getAuthHeaders() });
  }

  updateItem(itemIdList: number[], newStoragePlaceId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/item`, { itemIdList, newStoragePlaceId }, { headers: this.getAuthHeaders() });
  }

  deleteItem(itemIdList: number[]): Observable<any> {
    return this.http.delete(`${this.apiUrl}/item`, { headers: this.getAuthHeaders(), body: { itemIdList } });
  }

  // Log management

  downloadLogs(filters: { itemNameId?: number; storagePlaceId?: number; createdBy?: number; fromDate?: string; toDate?: string }): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/log`, filters, { 
      headers: this.getAuthHeaders(), 
      responseType: 'blob' 
    });
  }
}