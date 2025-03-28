import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userEmail: string = '';
  userPassword: string = '';
  alertMessage: string = '';
  isError: boolean = false;
  showPassword: boolean = false;
  

  constructor(private baseService: BaseService, private router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  showMessage(msg: string, isError: boolean = false, duration: number = 3000): void {
    this.alertMessage = msg;
    this.isError = isError;
    setTimeout(() => {
      this.alertMessage = '';
    }, duration);
  }

  loginUser(): void {

    this.baseService.loginUser(this.userEmail, this.userPassword).subscribe(
      response => {
        if (response.token) {
          localStorage.setItem('userEmail',this.userEmail);
          localStorage.setItem('authToken',response.token);
          this.router.navigate(['/dashboard']);
          console.log('Logged in:', response);
          
        }
      },
      error => {
        if(error.status == 403) {
          this.showMessage('A felhasználó letiltva! Keressen fel egy rendszergazdát!', true, 5000);
        }
        else {
          this.showMessage('Hibás email vagy jelszó!', true, 5000);
        }
        console.error('Error logging in:', error);
      }
    );
  }

  passwordChange(): void {
    this.baseService.passwordChange(this.userEmail).subscribe(
      response => {
        this.showMessage('Jelszó elküldve az email címre!', false, 5000); // Success message
        console.log('Password change:', response);
      },
      error => {
        if (error.status == 500) {
          this.showMessage('Nem található felhasználó ilyen email címmel!', true, 5000); // Error message for no match
        } else {
          this.showMessage('Hiba történt a jelszó visszaállítása során!', true, 5000); // General error message
        }
        console.error('Error changing password:', error);
      }
    );
  }

}
