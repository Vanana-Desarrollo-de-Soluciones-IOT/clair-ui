import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthQueryService, TokenMetadata } from '../../../domain/services/auth-query-service';
import { AuthGateway, AUTH_GATEWAY } from '../../../infrastructure/api/gateways/auth.gateway';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthQueryServiceImpl implements AuthQueryService {
  constructor(@Inject(AUTH_GATEWAY) private readonly authGateway: AuthGateway) {}

  handleVerifyToken(): Observable<TokenMetadata> {
    return this.authGateway.verifyToken().pipe(
      map(response => Object.freeze({
        valid: response.valid,
        email: response.email,
        expiresAt: response.expiresAt,
      }))
    );
  }
}
