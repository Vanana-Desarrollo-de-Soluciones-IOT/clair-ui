import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_QUERY_SERVICE, AuthQueryService } from '../../domain/services/auth-query-service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authQueryService = inject(AUTH_QUERY_SERVICE) as AuthQueryService;

  return authQueryService.handleVerifyToken().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
