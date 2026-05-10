import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthGateway } from './auth.gateway';
import { SignUpResource } from '../../../interfaces/rest/resources/sign-up.resource';
import { SignUpResponseResource } from '../../../interfaces/rest/resources/sign-up-response.resource';
import { SignInResource } from '../../../interfaces/rest/resources/sign-in.resource';
import { SignInResponseResource } from '../../../interfaces/rest/resources/sign-in-response.resource';
import { RefreshTokenResource } from '../../../interfaces/rest/resources/refresh-token.resource';
import { RefreshTokenResponseResource } from '../../../interfaces/rest/resources/refresh-token-response.resource';
import { ConfirmRegistrationResource } from '../../../interfaces/rest/resources/confirm-registration.resource';
import { ConfirmRegistrationResponseResource } from '../../../interfaces/rest/resources/confirm-registration-response.resource';
import { TokenMetadataResource } from '../../../interfaces/rest/resources/token-metadata.resource';
import { GoogleSignInResource } from '../../../interfaces/rest/resources/google-sign-in.resource';

@Injectable({ providedIn: 'root' })
export class AuthHttpGateway implements AuthGateway {
  private readonly baseUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private readonly http: HttpClient) {}

  signUp(resource: SignUpResource): Observable<SignUpResponseResource> {
    return this.http.post<SignUpResponseResource>(`${this.baseUrl}/sign-up`, resource);
  }

  signIn(resource: SignInResource): Observable<SignInResponseResource> {
    return this.http.post<SignInResponseResource>(`${this.baseUrl}/sign-in`, resource);
  }

  refreshToken(resource: RefreshTokenResource): Observable<RefreshTokenResponseResource> {
    return this.http.post<RefreshTokenResponseResource>(`${this.baseUrl}/refresh`, resource);
  }

  confirmRegistration(resource: ConfirmRegistrationResource): Observable<ConfirmRegistrationResponseResource> {
    return this.http.post<ConfirmRegistrationResponseResource>(`${this.baseUrl}/confirm`, resource);
  }

  verifyToken(): Observable<TokenMetadataResource> {
    return this.http.get<TokenMetadataResource>(`${this.baseUrl}/verify`);
  }

  signOut(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sign-out`);
  }

  googleSignIn(resource: GoogleSignInResource): Observable<SignInResponseResource> {
    return this.http.post<SignInResponseResource>(`${this.baseUrl}/google/sign-in`, resource);
  }

  getGoogleAuthorizeUrl(): string {
    return `${this.baseUrl}/google/authorize`;
  }
}
