import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: (allowedRoles: string[]) => CanActivateFn = (allowedRoles) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.getUser();

    if (user && user.role && allowedRoles.includes(user.role)) {
      return true;
    }
    
    // Si no tiene el rol, lo enviamos al login o a una página de acceso denegado
    return router.createUrlTree(['/login']);
  };
};