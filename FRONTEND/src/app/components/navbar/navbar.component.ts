import { Component } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isAuthenticated: boolean = false;

  constructor(private baseService: BaseService, private router: Router) { }

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth(): boolean {
    const token = localStorage.getItem('authToken');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    if (token && payload && payload.isDisabled == false && payload.isFirstLogin == false) {
      return true;
    }
    return false;
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin;
    }
    return false;
  }

  logoutUser(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
    console.log('Logged out');
  }
}
