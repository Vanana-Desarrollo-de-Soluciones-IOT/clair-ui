import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TokenStorageGateway, TOKEN_STORAGE_GATEWAY } from '../../../infrastructure/storage/token-storage.gateway';

@Component({
  selector: 'app-auth-callback-page',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './auth-callback-page.component.html',
  styleUrl: './auth-callback-page.component.css',
})
export class AuthCallbackPageComponent {
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TOKEN_STORAGE_GATEWAY);

  errorMessage: string | null = null;

  constructor() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    const reason = params.get('reason');

    if (reason === 'google_oauth_failed') {
      this.errorMessage = 'Google authentication failed. Please try again.';
      return;
    }

    if (token && refreshToken) {
      this.tokenStorage.setTokens(token, refreshToken);
      this.router.navigate(['/overview']);
    } else {
      this.errorMessage = 'Authentication incomplete. Missing tokens.';
    }
  }
}
