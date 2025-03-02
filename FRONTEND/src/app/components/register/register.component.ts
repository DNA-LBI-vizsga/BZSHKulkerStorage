import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  name: string = '';
  user_password: string = '';
  isAdmin: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private baseService: BaseService, private router: Router) { }

  registerUser(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.baseService.registerUser(this.name, this.user_password, this.isAdmin).subscribe(
        response => {
          this.successMessage = 'User registered successfully.';
          this.errorMessage = '';
          console.log('User registered:', response);
        },
        error => {
          this.errorMessage = 'Error registering user. Please try again.';
          this.successMessage = '';
          console.error('Error registering user:', error);
        }
      );
    } else {
      this.errorMessage = 'You must be logged in to register a user.';
    }
  }
}