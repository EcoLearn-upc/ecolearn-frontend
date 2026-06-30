import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const redirectTo: string = route.data?.['redirectTo'] ?? '/auth';
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate([redirectTo]);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.navigate([redirectTo]);
      return false;
    }
  } catch {
    localStorage.removeItem('token');
    router.navigate([redirectTo]);
    return false;
  }

  return true;
};
