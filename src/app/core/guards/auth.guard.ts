import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const redirectTo: string = route.data?.['redirectTo'] ?? '/auth';
  const token = authService.getToken();

  if (!token) {
    router.navigate([redirectTo]);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      authService.logout();
      return false;
    }
  } catch {
    authService.logout();
    return false;
  }

  return true;
};
