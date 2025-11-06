import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const clonedReq = req.clone({
    withCredentials: true
  });

  return next(clonedReq).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            return next(clonedReq);
          }),
          catchError(refreshError => {
            authService.logout().subscribe(() => {
              router.navigate(['/auth/login']);
            });
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
