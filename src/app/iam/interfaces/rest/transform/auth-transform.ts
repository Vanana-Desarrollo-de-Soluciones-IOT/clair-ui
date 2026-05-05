import { SignUpCommand } from '../../../domain/model/commands/sign-up.command';
import { SignInCommand } from '../../../domain/model/commands/sign-in.command';
import { RefreshTokenCommand } from '../../../domain/model/commands/refresh-token.command';
import { ConfirmRegistrationCommand } from '../../../domain/model/commands/confirm-registration.command';
import { SignUpResource } from '../resources/sign-up.resource';
import { SignInResource } from '../resources/sign-in.resource';
import { RefreshTokenResource } from '../resources/refresh-token.resource';
import { ConfirmRegistrationResource } from '../resources/confirm-registration.resource';

export const signUpCommandToResource = (command: SignUpCommand): SignUpResource => {
  return Object.freeze({
    email: command.email.value,
    password: command.password.value,
  });
};

export const signInCommandToResource = (command: SignInCommand): SignInResource => {
  return Object.freeze({
    email: command.email.value,
    password: command.password.value,
  });
};

export const refreshTokenCommandToResource = (command: RefreshTokenCommand): RefreshTokenResource => {
  return Object.freeze({
    refreshToken: command.refreshToken.value,
  });
};

export const confirmRegistrationCommandToResource = (command: ConfirmRegistrationCommand): ConfirmRegistrationResource => {
  return Object.freeze({
    sessionId: command.sessionId,
    verificationCode: command.code.value,
  });
};
