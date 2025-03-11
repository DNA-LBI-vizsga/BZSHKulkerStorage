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

  constructor(private baseService: BaseService, private router: Router) { }

  changePassword(): void {
    if(this.newPassword === this.confirmPassword){
    this.baseService.firstLogin(this.newPassword).subscribe(
      response => {
        console.log('Password changed:', response);
        alert('Password changed successfully');
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Error changing password:', error);
      }
    );
  }
  else{
    alert('Passwords do not match');
    console.error('Passwords do not match');
  }
}

}
