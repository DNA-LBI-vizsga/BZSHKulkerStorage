import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userEmail: string = '';
  userPassword: string = '';
  
  showPassword: boolean = false;

  alertMessage: string | null = null;
  isError: boolean = false;
  timeoutId: any = null;
  
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
  }

  loginUser(): void {
    this.userService.loginUser(this.userEmail, this.userPassword).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('userEmail',this.userEmail);
          localStorage.setItem('authToken',response.token);
          this.router.navigate(['/dashboard']);
          console.log('Logged in:', response);
          
        }
      },
      error: (error) => {
        if(error.status == 403) {
          this.showMessage('Felhasználó letiltva! Keressen fel egy rendszergazdát!', true, 5000);
        }
        else {
          this.showMessage('Hibás email vagy jelszó!', true, 5000);
        }
        console.error('Error logging in:', error);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  passwordChange(): void {
    this.userService.passwordChange(this.userEmail).subscribe({
      next: (response) => {
        this.showMessage('Jelszó elküldve az email címre!', false, 5000);
        console.log('Password change:', response);
      },
      error: (error) => {
        if (error.status == 500) {
          this.showMessage('Nem található felhasználó ilyen email címmel!', true, 5000);
        } else {
          this.showMessage('Hiba történt a jelszó visszaállítása során!', true, 5000);
        }
        console.error('Error changing password:', error);
      }
    });
  }

  showMessage(msg: string, isError: boolean, duration: number): void {
    this.alertMessage = msg;
    this.isError = isError;
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.alertMessage = null;
      this.isError = false;
      this.timeoutId = null;
    }, duration);
  }

}
