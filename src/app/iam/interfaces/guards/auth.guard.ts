import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthQueryServiceImpl } from '../../application/internal/queryservices/auth-query-service.impl';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authQueryService = inject(AuthQueryServiceImpl);

  return authQueryService.handleVerifyToken().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
