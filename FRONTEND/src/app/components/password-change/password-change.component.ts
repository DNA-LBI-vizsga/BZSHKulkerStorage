import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.css'
})
export class PasswordChangeComponent {
  newPassword: string = '';
  confirmPassword: string = '';

  showPassword: boolean = false;
  
  alertMessage: string | null = null;
  isError: boolean = false;
  timeoutId: any = null;

  passwordRequirements = [
    { text: 'Min. 8 karakter hosszú', isValid: false },
    { text: 'Nagy betű', isValid: false },
    { text: 'Kis betű', isValid: false },
    { text: 'Szám', isValid: false },
    { text: 'Speciális karakter (!@#$%^&*)', isValid: false }
  ];

  constructor(private userService : UserService, private router: Router) { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  changePassword(): void {
    if(this.newPassword === this.confirmPassword){
      this.userService.firstLogin(this.newPassword).subscribe({
        next: (response) => {
          console.log('Password changed:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          if(error.status == 400) {
            const errorMessage = error.error.errors[0].msg;
            this.showMessage(errorMessage, true, 5000);
          }
          else {
          this.showMessage('Hiba a jelszó megváltoztatásakor! Próbálja újra!', true, 5000);
          }
          console.error('Error changing password:', error);
      }});
    }
    else {
      this.showMessage('A beütött jelszavak nem egyeznek!', true, 5000);
      console.error('Passwords do not match');
    }
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

  checkPasswordRequirements(): void {
    const password = this.newPassword;
    this.passwordRequirements[0].isValid = password.length >= 8;
    this.passwordRequirements[1].isValid = /[A-Z]/.test(password);
    this.passwordRequirements[2].isValid = /[a-z]/.test(password);
    this.passwordRequirements[3].isValid = /\d/.test(password);
    this.passwordRequirements[4].isValid = /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/]/.test(password);
  }

  areAllRequirementsValid(): boolean {
    return this.passwordRequirements.every(req => req.isValid);
  }
}
