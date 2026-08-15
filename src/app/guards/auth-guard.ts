import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user';

export const authGuard = (
  allowedRoles: User['role'][],
): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      return router.createUrlTree(['/login']);
    }

    const user = authService.getCurrentUser();

    if (!user || !allowedRoles.includes(user.role)) {
      switch (user?.role) {
        case 'admin':
          return router.createUrlTree(['/admin']);

        case 'lawyer':
          return router.createUrlTree(['/painel-advogado']);

        case 'user':
          return router.createUrlTree(['/minha-conta']);

        default:
          return router.createUrlTree(['/login']);
      }
    }

    return true;
  };
};

