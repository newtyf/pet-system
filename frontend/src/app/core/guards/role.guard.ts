import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const user = authService.getCurrentUser();
  const hasRole = user && requiredRoles.includes(user.role);

  if (!hasRole) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
