import { InjectionToken } from '@angular/core';

export interface TokenStorageGateway {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
}

export const TOKEN_STORAGE_GATEWAY = new InjectionToken<TokenStorageGateway>('TokenStorageGateway');
