import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp && nowInSeconds >= payload.exp) {
      console.warn('Token expired');
      localStorage.removeItem('authToken');
      router.navigate(['/login']);
      return false;
    }

    if (payload.isAdmin) {
      return true;
    } else {
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