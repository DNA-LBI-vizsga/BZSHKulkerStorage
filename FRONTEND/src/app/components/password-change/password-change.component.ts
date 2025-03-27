import { Component } from '@angular/core';
import { BaseService } from '../../services/base.service';
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
  alertMessage: string = '';
  isError: boolean = false;

  constructor(private baseService: BaseService, private router: Router) { }

  showMessage(msg: string, isError: boolean = false, duration: number = 3000): void {
    this.alertMessage = msg;
    this.isError = isError;
    setTimeout(() => {
      this.alertMessage = '';
    }, duration);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  changePassword(): void {
    if(this.newPassword === this.confirmPassword){
    this.baseService.firstLogin(this.newPassword).subscribe(
      response => {
        console.log('Password changed:', response);
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
      },
      error => {
        this.showMessage('Hiba a jelszó megváltoztatásakor! Próbálja újra!', true, 5000);
        console.error('Error changing password:', error);
      }
    );
  }
  else{
    this.showMessage('A beütött jelszavak nem egyeznek!', true, 5000);
    console.error('Passwords do not match');
  }
}

}
