import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authService: AuthService, private router: Router) { }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logoutUser(): void {
    this.router.navigate(['/login']);
    console.log('Logged out');
  }
}
