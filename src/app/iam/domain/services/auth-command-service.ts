import { Observable } from 'rxjs';
import { SignUpCommand } from '../model/commands/sign-up.command';
import { SignInCommand } from '../model/commands/sign-in.command';
import { RefreshTokenCommand } from '../model/commands/refresh-token.command';
import { ConfirmRegistrationCommand } from '../model/commands/confirm-registration.command';
import { SignOutCommand } from '../model/commands/sign-out.command';
import { UserId } from '../model/valueobjects/user-id.value-object';
import { AccessToken } from '../model/valueobjects/access-token.value-object';
import { RefreshToken } from '../model/valueobjects/refresh-token.value-object';

export interface AuthCommandService {
  handleSignUp(command: SignUpCommand): Observable<{ sessionId: string; message: string }>;
  handleSignIn(command: SignInCommand): Observable<{ accessToken: AccessToken; refreshToken: RefreshToken }>;
  handleRefreshToken(command: RefreshTokenCommand): Observable<{ accessToken: AccessToken; refreshToken: RefreshToken }>;
  handleConfirmRegistration(command: ConfirmRegistrationCommand): Observable<{ userId: UserId; email: string }>;
  handleSignOut(command: SignOutCommand): Observable<void>;
}
