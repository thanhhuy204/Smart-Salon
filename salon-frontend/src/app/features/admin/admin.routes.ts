import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            m => m.DashboardComponent
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./pages/admin-appointments/admin-appointments.component').then(
            m => m.AdminAppointmentsComponent
          ),
      },
      {
        path: 'staff',
        loadComponent: () =>
          import('./pages/admin-staff/admin-staff.component').then(
            m => m.AdminStaffComponent
          ),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./pages/admin-services/admin-services.component').then(
            m => m.AdminServicesComponent
          ),
      },
    ],
  },
];
