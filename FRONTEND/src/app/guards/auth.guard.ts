import { inject} from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

    const token = localStorage.getItem('authToken');
    if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.isDisabled==false) {
        return true;
      }
      else {
        router.navigate(['/login']);
        return false;
      }
    } catch (e) {
      console.error('Invalid token format', e);
      router.navigate(['/login']);
      return false;
    }
  } else {
    router.navigate(['/login']);
    return false;
  }
};