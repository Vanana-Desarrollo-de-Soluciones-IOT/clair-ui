import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';


export type TokenMetadata = Readonly<{
  valid: boolean;
  email: string;
  expiresAt: string;
}>;

export interface AuthQueryService {
  handleVerifyToken(): Observable<TokenMetadata>;
}

export const AUTH_QUERY_SERVICE = new InjectionToken<AuthQueryService>('AuthQueryService');
