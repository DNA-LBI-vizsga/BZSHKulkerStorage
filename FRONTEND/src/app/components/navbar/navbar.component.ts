import { Component } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private baseService: BaseService, private router: Router) { }

  isAdmin(): boolean {
    const token = this.baseService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.isAdmin;
    }
    return false;
  }

  logoutUser(): void {
    this.baseService.removeToken();
    this.router.navigate(['/login']); // Navigate to the login page after logout
    console.log('Logged out');
  }
}
