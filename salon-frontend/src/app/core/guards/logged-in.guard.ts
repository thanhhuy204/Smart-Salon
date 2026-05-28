import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loggedInGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) return router.createUrlTree(['/admin']);
  if (auth.isLoggedIn()) return router.createUrlTree(['/']);
  return true;
};
