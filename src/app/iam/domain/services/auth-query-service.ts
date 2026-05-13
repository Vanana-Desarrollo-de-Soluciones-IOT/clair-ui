import { Observable } from 'rxjs';


export type TokenMetadata = Readonly<{
  valid: boolean;
  email: string;
  expiresAt: string;
}>;

export interface AuthQueryService {
  handleVerifyToken(): Observable<TokenMetadata>;
}
