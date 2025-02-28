import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private apiUrl = 'http://localhost:3000/leltar'; // Adjust the URL as needed

  constructor(private http: HttpClient) { }

  getStoragePlaces(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/storagePlace`, { headers });
  }

  getValues(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/value`, { headers });
  }

  getItemNames(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/itemName`, { headers });
  }

  createStoragePlace(storage: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/storagePlace`, { storage }, { headers });
  }

  createItemName(item: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/itemName`, { item }, { headers });
  }

  createValue(value: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/value`, { value }, { headers });
  }

  createItem(quantity: number, item_name: string, value: string, storage_place: string, description: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/item/${quantity}`, { item_name, value, storage_place, description }, { headers });
  }

  registerUser(name: string, user_password: string, isAdmin: boolean): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/register`, { name, user_password, isAdmin }, { headers });
  }

  loginUser(name: string, user_password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { name, user_password });
  }

  updateItemName(id: number, item: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/itemName/${id}`, { item }, { headers });
  }

  deleteStoragePlace(id: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/storagePlace/${id}`, { headers });
  }

  deleteItemName(id: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/itemName/${id}`, { headers });
  }

  // Token management
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }
}
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class BaseService {

//   private apiUrl = 'http://localhost:3000/leltar'; // Adjust the URL as needed

//   constructor(private http: HttpClient) { }

//   getStoragePlaces(): Observable<any> {
//     const token = this.getToken();
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.get(`${this.apiUrl}/storagePlace`);
//   }

//   getValues(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/value`);
//   }

//   getItemNames(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/itemName`);
//   }

//   createStoragePlace(storage: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/storagePlace`, { storage });
//   }

//   createItemName(item: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/itemName`, { item });
//   }

//   createValue(value: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/value`, { value });
//   }

//   createItem(quantity: number, item_name: string, value: string, storage_place: string, description: string): Observable<any> {
//     const token = this.getToken();
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.post(`${this.apiUrl}/item/${quantity}`, { item_name, value, storage_place, description }, { headers });
//   }

//   registerUser(name: string, user_password: string, isAdmin: boolean): Observable<any> {
//     const token = this.getToken();
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//     return this.http.post(`${this.apiUrl}/register`, { name, user_password, isAdmin }, { headers });
//   }

//   loginUser(name: string, user_password: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, { name, user_password });
//   }

//   updateItemName(id: number, item: string): Observable<any> {
//     return this.http.put(`${this.apiUrl}/itemName/${id}`, { item });
//   }

//   deleteStoragePlace(id: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/storagePlace/${id}`);
//   }

//   deleteItemName(id: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/itemName/${id}`);
//   }

//   // Token management
//   getToken(): string | null {
//     return localStorage.getItem('authToken');
//   }

//   storeToken(token: string): void {
//     localStorage.setItem('authToken', token);
//   }

//   removeToken(): void {
//     localStorage.removeItem('authToken');
//   }
// }
