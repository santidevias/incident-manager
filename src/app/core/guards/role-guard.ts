import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const hasRoleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
      return true;
    }

    const user = authService.currentUser();
    if (user && allowedRoles.includes(user.role)) {
      return true;
    }

    return router.createUrlTree(['/login']);
  };
};

export const roleRedirectGuard = (): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const role = authService.role();
    if (role === 'admin') {
      return router.createUrlTree(['/dashboard']);
    } else if (role === 'support' || role === 'requester') {
      return router.createUrlTree(['/incidents']);
    }
    return router.createUrlTree(['/login']);
  };
};
