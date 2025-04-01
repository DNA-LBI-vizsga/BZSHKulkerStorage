import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Külker Leltár';

  checkAuth(): boolean {
    const token = localStorage.getItem('authToken');
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
    if (token && payload && payload.isDisabled == false && payload.isFirstLogin == false) {
      return true;
    }
    return false;
  }
}
