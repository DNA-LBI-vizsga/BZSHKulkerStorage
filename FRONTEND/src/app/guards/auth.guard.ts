import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now >= payload.exp) {
      console.warn('Token expired');
      localStorage.removeItem('authToken');
      router.navigate(['/login']);
      return false;
    }

    if (payload.isDisabled === false) {
      return true;
    } else {
      console.warn('User is disabled');
      localStorage.removeItem('authToken');
      router.navigate(['/login']);
      return false;
    }

  } catch (e) {
    console.error('Invalid token format', e);
    localStorage.removeItem('authToken');
    router.navigate(['/login']);
    return false;
  }
};