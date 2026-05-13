import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
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

export interface AuthGateway {
  signUp(resource: SignUpResource): Observable<SignUpResponseResource>;
  signIn(resource: SignInResource): Observable<SignInResponseResource>;
  refreshToken(resource: RefreshTokenResource): Observable<RefreshTokenResponseResource>;
  confirmRegistration(resource: ConfirmRegistrationResource): Observable<ConfirmRegistrationResponseResource>;
  verifyToken(): Observable<TokenMetadataResource>;
  signOut(): Observable<void>;
  googleSignIn(resource: GoogleSignInResource): Observable<SignInResponseResource>;
  getGoogleAuthorizeUrl(): string;
}

export const AUTH_GATEWAY = new InjectionToken<AuthGateway>('AuthGateway');
