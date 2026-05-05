import { Observable } from 'rxjs';
import { VerifyTokenQuery } from '../model/queries/verify-token.query';

export type TokenMetadata = Readonly<{
  valid: boolean;
  email: string;
  expiresAt: string;
}>;

export interface AuthQueryService {
  handleVerifyToken(query: VerifyTokenQuery): Observable<TokenMetadata>;
}
