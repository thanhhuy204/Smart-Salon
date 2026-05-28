import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const profileRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./profile.component').then(m => m.ProfileComponent),
  },
  {
    path: 'change-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./change-password/change-password.component').then(m => m.ChangePasswordComponent),
  },
  {
    path: 'appointments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/appointments/appointments.component').then(m => m.AppointmentsComponent),
  },
];
