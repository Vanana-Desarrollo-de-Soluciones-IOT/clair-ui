import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthQueryService, TokenMetadata } from '../../../domain/services/auth-query-service';
import { AuthGateway, AUTH_GATEWAY } from '../../../infrastructure/api/gateways/auth.gateway';
import { VerifyTokenQuery } from '../../../domain/model/queries/verify-token.query';

@Injectable({ providedIn: 'root' })
export class AuthQueryServiceImpl implements AuthQueryService {
  constructor(@Inject(AUTH_GATEWAY) private readonly authGateway: AuthGateway) {}

  handleVerifyToken(query: VerifyTokenQuery): Observable<TokenMetadata> {
    return this.authGateway.verifyToken(query.accessToken.value);
  }
}
