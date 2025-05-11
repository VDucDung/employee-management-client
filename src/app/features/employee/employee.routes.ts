import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { authGuard } from '../../core/auth/auth.guard';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    canActivate: [authGuard],
  },
];
