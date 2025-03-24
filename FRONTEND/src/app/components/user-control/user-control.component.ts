import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-user-control',
  templateUrl: './user-control.component.html',
  styleUrls: ['./user-control.component.css']
})
export class UserControlComponent implements OnInit{

  userEmail: string = '';
  isAdmin: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  users: any[] = [];
  currentUser: string = '';

  alertMessage: string | null = null;
  isError: boolean = false;

  constructor(private baseService: BaseService, private router: Router){ }

  ngOnInit(): void {
    this.loadUsers();
    this.currentUser = localStorage.getItem('userEmail') || '';
  }

  showMessage(msg: string, isError: boolean = false, duration: number = 3000): void {
    this.alertMessage = msg;
    this.isError = isError;
    setTimeout(() => {
      this.alertMessage = null;
      this.isError = false;
    }, duration);
  }

  registerUser(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.baseService.registerUser(this.userEmail, this.isAdmin).subscribe(
        response => {
          this.showMessage('Email kiküldve!', false, 5000);
          console.log('User registered:', response);
          this.loadUsers();
        },
        error => {
          this.showMessage('Hiba a felvétel során!', true, 5000);
          console.error('Error registering user:', error);
        }
      );
    }
  }

  loadUsers(): void {
    this.baseService.getUsers().subscribe( data => {
      this.users = data;
      console.log('Users:', data);
    });
  }

  disableUser(userEmail: string): void {
    this.baseService.disableUser(userEmail).subscribe(
      response => {
        this.showMessage('Felhasználó letiltva!', false, 3000);
        console.log('User disabled:', response);
        this.loadUsers();
      },
      error => {
        this.showMessage('Hiba a letiltás során. Próbálja újra!', true, 3000);
        console.error('Error disabling user:', error);
      }
    );
  }

  enableUser(userEmail: string): void {
    this.baseService.enableUser(userEmail).subscribe(
      response => {
        this.showMessage('Felhasználó aktiválva!', false, 3000);
        console.log('User enabled:', response);
        this.loadUsers();
      },
      error => {
        this.showMessage('Hiba a felhasználó aktiválásakor! Próbálja újra!', true, 3000);
        console.error('Error enabling user:', error);
      }
    );
  }

  promoteUser(userEmail: string): void {
    this.baseService.promoteUser(userEmail).subscribe(
      response => {
        this.showMessage('Admin jog átállítva!', false, 3000);
        console.log('User promoted:', response);
        this.loadUsers();
      },
      error => {
        this.showMessage('Hiba a jog váloztatásnál! Próbálja újra!', true, 3000);
        console.error('Error promoting user:', error);
      }
    );
  }

  demoteUser(userEmail: string): void {
    this.baseService.demoteUser(userEmail).subscribe(
      response => {
        this.showMessage('Admin jog elvéve!', false, 3000);
        console.log('User demoted:', response);
        this.loadUsers();
      },
      error => {
        this.showMessage('Hiba az admin jog elvételekor! Próbálja újra!', true, 3000);
        console.error('Error demoting user:', error);
      }
    );
  } 
}