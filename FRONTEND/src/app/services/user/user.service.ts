import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers(): Observable<any> {
      return this.http.get(`${this.apiUrl}/users`, { headers: this.authService.getAuthHeaders() });
    }
  
  disableUser(userEmail: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/disable`, { userEmail },{ headers: this.authService.getAuthHeaders() });
  }
  
  enableUser(userEmail: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/enable`, { userEmail }, { headers: this.authService.getAuthHeaders() });
  }
  
  promoteUser(userEmail: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/promote`, { userEmail }, { headers: this.authService.getAuthHeaders() });
  }
  
  demoteUser(userEmail: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/demote`, { userEmail }, { headers: this.authService.getAuthHeaders() });
  }

  loginUser(userEmail: string, userPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { userEmail, userPassword });
  }

  firstLogin(userPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/firstLogin`, { userPassword }, { headers: this.authService.getAuthHeaders() });
  }

  passwordChange(userEmail: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/passwordChange`, { userEmail });
  }

  registerUser(userEmail: string, isAdmin: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { userEmail,  isAdmin }, { headers: this.authService.getAuthHeaders() });
  }
}
