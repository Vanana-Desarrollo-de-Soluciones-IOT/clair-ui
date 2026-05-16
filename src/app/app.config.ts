import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AUTH_GATEWAY } from './iam/infrastructure/api/gateways/auth.gateway';
import { AuthHttpGateway } from './iam/infrastructure/api/gateways/auth-http.gateway';
import { TOKEN_STORAGE_GATEWAY } from './iam/infrastructure/storage/token-storage.gateway';
import { LocalTokenStorageGateway } from './iam/infrastructure/storage/local-token-storage.gateway';
import { AuthHttpInterceptor } from './iam/infrastructure/api/interceptors/auth-http.interceptor';
import { DEVICE_GATEWAY } from './device/infrastructure/api/gateways/device.gateway';
import { DeviceHttpGateway } from './device/infrastructure/api/gateways/device-http.gateway';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: AUTH_GATEWAY, useClass: AuthHttpGateway },
    { provide: TOKEN_STORAGE_GATEWAY, useClass: LocalTokenStorageGateway },
    { provide: DEVICE_GATEWAY, useClass: DeviceHttpGateway },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
};
