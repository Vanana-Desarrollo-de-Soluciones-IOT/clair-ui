import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthCommandServiceImpl } from '../../../application/internal/commandservices/auth-command-service.impl';
import { TokenStorageGateway, TOKEN_STORAGE_GATEWAY } from '../../../infrastructure/storage/token-storage.gateway';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="home-container">
      <mat-card class="home-card">
        <h1>Welcome to Clair IOT</h1>
        <p>You are successfully logged in.</p>
        <button mat-flat-button color="warn" [disabled]="isLoggingOut" (click)="logout()">
          <mat-icon>logout</mat-icon>
          {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
        </button>
      </mat-card>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .home-card {
      max-width: 500px;
      width: 100%;
      padding: 40px;
      text-align: center;
    }
    h1 {
      margin-bottom: 16px;
      color: #333;
    }
    p {
      margin-bottom: 24px;
      color: #666;
    }
  `],
})
export class HomePageComponent {
  private readonly router = inject(Router);
  private readonly authCommandService = inject(AuthCommandServiceImpl);
  private readonly tokenStorage = inject(TOKEN_STORAGE_GATEWAY);

  isLoggingOut = false;

  logout(): void {
    this.isLoggingOut = true;

    this.authCommandService.handleSignOut().subscribe({
      next: () => this.clearSessionAndNavigate(),
      error: () => this.clearSessionAndNavigate(),
    });
  }

  private clearSessionAndNavigate(): void {
    this.tokenStorage.clearTokens();
    this.isLoggingOut = false;
    this.router.navigate(['/login']);
  }
}
