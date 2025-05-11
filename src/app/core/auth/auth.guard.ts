import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Nếu đã đăng nhập, cho phép truy cập
    return true;
  }

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
