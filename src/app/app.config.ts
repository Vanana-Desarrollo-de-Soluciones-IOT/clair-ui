import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AUTH_GATEWAY } from './iam/infrastructure/api/gateways/auth.gateway';
import { AuthHttpGateway } from './iam/infrastructure/api/gateways/auth-http.gateway';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: AUTH_GATEWAY, useClass: AuthHttpGateway },
  ],
};
