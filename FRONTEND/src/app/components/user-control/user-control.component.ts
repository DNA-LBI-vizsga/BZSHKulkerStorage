import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-user-control',
  templateUrl: './user-control.component.html',
  styleUrls: ['./user-control.component.css']
})
export class UserControlComponent implements OnInit {

  newUserEmail: string = '';
  newUserAdmin: boolean = false;

  users: any[] = [];
  currentUser: string = localStorage.getItem('userEmail') || '';

  filteredUsers: any[] = [];
  filterText: string = '';

  alertMessage: string | null = null;
  isError: boolean = false;
  timeoutId: any = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.filteredUsers = this.users;

      this.filteredUsers.sort((a, b) => {
        if (a.userEmail == this.currentUser) return -1;
        if (b.userEmail == this.currentUser) return 1;
        if (a.isAdmin && !b.isAdmin) return -1;
        if (!a.isAdmin && b.isAdmin) return 1;
        return a.userEmail.localeCompare(b.userEmail);
      });
    });
  }

  registerUser(): void {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!emailRegex.test(this.newUserEmail)) {
      this.showMessage('Kérem adjon meg egy érvényes email címet!', true, 3000);
      return;
    }

    const emailExists = this.users.some(user => user.userEmail === this.newUserEmail);
    if (emailExists) {
      this.showMessage('Már létezik felhasználó ilyen email címmel!', true, 3000);
      return;
    }

    this.userService.registerUser(this.newUserEmail, this.newUserAdmin).subscribe({
      next: (response) => {
        this.showMessage('Email kiküldve!', false, 5000);
        console.log('User registered:', response);
        this.newUserEmail = '';
        this.loadUsers();
      },
      error: (error) => {
        this.showMessage('Hiba a felvétel során!', true, 5000);
        console.error('Error registering user:', error);
      }
    });
  }

  disableUser(userEmail: string): void {
    this.userService.disableUser(userEmail).subscribe({
      next: (response) => {
        this.showMessage('Felhasználó letiltva!', false, 3000);
        console.log('User disabled:', response);
        this.loadUsers();
      },
      error: (error) => {
        this.showMessage('Hiba a letiltás során. Próbálja újra!', true, 3000);
        console.error('Error disabling user:', error);
      }
    });
  }

  enableUser(userEmail: string): void {
    this.userService.enableUser(userEmail).subscribe({
      next: (response) => {
        this.showMessage('Felhasználó aktiválva!', false, 3000);
        console.log('User enabled:', response);
        this.loadUsers();
      },
      error: (error) => {
        this.showMessage('Hiba a felhasználó aktiválásakor! Próbálja újra!', true, 3000);
        console.error('Error enabling user:', error);
      }
    });
  }

  promoteUser(userEmail: string): void {
    this.userService.promoteUser(userEmail).subscribe({
      next: (response) => {
        this.showMessage('Admin jog átállítva!', false, 3000);
        console.log('User promoted:', response);
        this.loadUsers();
      },
      error: (error) => {
        this.showMessage('Hiba a jog váloztatásnál! Próbálja újra!', true, 3000);
        console.error('Error promoting user:', error);
      }
    });
  }

  demoteUser(userEmail: string): void {
    this.userService.demoteUser(userEmail).subscribe({
      next: (reponse) => {
        this.showMessage('Admin jog elvéve!', false, 3000);
        console.log('User demoted:', reponse);
        this.loadUsers();
      },
      error: (error) => {
        this.showMessage('Hiba az admin jog elvételekor! Próbálja újra!', true, 3000);
        console.error('Error demoting user:', error);
      }
    });
  }

  applyFilter(): void {
    this.filteredUsers = this.users.filter(user =>
      user.userEmail.toLowerCase().includes(this.filterText.toLowerCase())
    );
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