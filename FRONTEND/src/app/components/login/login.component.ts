import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userName: string = '';
  userPassword: string = '';
  errorMessage: string = '';

  constructor(private baseService: BaseService, private router: Router) { }

  loginUser(): void {
    this.baseService.loginUser(this.userName, this.userPassword).subscribe(
      response => {
        if (response.token) {
          localStorage.setItem('authToken',response.token);
          this.router.navigate(['/navbar/dashboard']); // Navigate to the home page or another page after login
          console.log('Logged in:', response);
        }
      },
      error => {
        this.errorMessage = 'Invalid credentials. Please try again.';
        console.error('Error logging in:', error);
      }
    );
  }
}
