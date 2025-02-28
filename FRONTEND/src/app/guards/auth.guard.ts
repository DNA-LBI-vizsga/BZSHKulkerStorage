import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BaseService } from '../services/base.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private baseService: BaseService, private router: Router) { }

  canActivate(): boolean {
    if (this.baseService.getToken()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}