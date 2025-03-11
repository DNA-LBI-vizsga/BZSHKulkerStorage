import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BaseService } from '../services/base.service';

@Injectable({
  providedIn: 'root'
})
export class adminGuard implements CanActivate {

  constructor(private baseService: BaseService, private router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if(payload.isAdmin){
        return true;
      }
      else{
        this.router.navigate(['/login']);
        localStorage.removeItem('authToken');
        return false;  
        }
    }
    else{
      this.router.navigate(['/login']);
      return false;
    }

  }
}