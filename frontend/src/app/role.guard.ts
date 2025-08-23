import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUserValue;

  if (!currentUser) {
    // Si no hay usuario logueado, redirigir al login
    return router.createUrlTree(['/login']);
  }

  // Obtener el rol requerido de la configuración de la ruta
  const requiredRole = route.data['role'] as string;

  if (requiredRole && currentUser.role !== requiredRole) {
    // Si el usuario no tiene el rol requerido, redirigir según su rol actual
    if (currentUser.role === 'ADMIN') {
      return router.createUrlTree(['/admin']);
    } else if (currentUser.role === 'USER') {
      return router.createUrlTree(['/user']);
    }

    // Fallback: redirigir al login si no se puede determinar el rol
    return router.createUrlTree(['/login']);
  }

  // Si el usuario tiene el rol correcto o no se requiere rol específico, permitir acceso
  return true;
};
