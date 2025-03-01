import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  name: string = '';
  user_password: string = '';
  errorMessage: string = '';

  constructor(private baseService: BaseService, private router: Router) { }

  loginUser(): void {
    this.baseService.loginUser(this.name, this.user_password).subscribe(
      response => {
        if (response.token) {
          this.baseService.storeToken(response.token);
          this.router.navigate(['/navbar']); // Navigate to the home page or another page after login
          console.log('Logged in:', response);
        }
      },
      error => {
        this.errorMessage = 'Invalid credentials. Please try again.';
        console.error('Error logging in:', error);
      }
    );
  }

  logoutUser(): void {
    this.baseService.removeToken();
    this.router.navigate(['/login']); // Navigate to the login page after logout
    console.log('Logged out');
  }
}
