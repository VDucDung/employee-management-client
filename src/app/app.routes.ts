import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((r) => r.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (r) => r.DASHBOARD_ROUTES
      ),
    canActivate: [authGuard],
  },

  {
    path: 'employees',
    loadChildren: () =>
      import('./features/employee/employee.routes').then(
        (r) => r.EMPLOYEE_ROUTES
      ),
    canActivate: [authGuard],
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  // Route fallback - chuyển hướng về dashboard nếu không tìm thấy route
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
