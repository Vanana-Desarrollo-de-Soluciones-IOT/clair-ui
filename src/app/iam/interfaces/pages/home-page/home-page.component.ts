import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { AuthCommandServiceImpl } from '../../../application/internal/commandservices/auth-command-service.impl';
import { TokenStorageGateway, TOKEN_STORAGE_GATEWAY } from '../../../infrastructure/storage/token-storage.gateway';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, SidebarComponent],
  template: `
    <div class="flex h-screen bg-[#0a0a0a]">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex items-center justify-center p-6 overflow-auto">
        <mat-card class="home-card !bg-[#141414] !border !border-white/10 !rounded-2xl">
          <h1 class="text-white text-2xl font-semibold mb-2">Welcome to Clair IOT</h1>
          <p class="text-gray-400 mb-6">You are successfully logged in.</p>
          <button mat-flat-button color="warn" [disabled]="isLoggingOut" (click)="logout()">
            <mat-icon>logout</mat-icon>
            {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
          </button>
        </mat-card>
      </main>
    </div>
  `,
  styles: [`
    .home-card {
      max-width: 500px;
      width: 100%;
      padding: 40px;
      text-align: center;
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
