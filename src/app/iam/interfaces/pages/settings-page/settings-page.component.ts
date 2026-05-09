import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/interfaces/components/header/header.component';
import { AuthCommandServiceImpl } from '../../../application/internal/commandservices/auth-command-service.impl';
import { TOKEN_STORAGE_GATEWAY } from '../../../infrastructure/storage/token-storage.gateway';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, SidebarComponent, HeaderComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
})
export class SettingsPageComponent {
  private readonly router = inject(Router);
  private readonly authCommandService = inject(AuthCommandServiceImpl);
  private readonly tokenStorage = inject(TOKEN_STORAGE_GATEWAY);

  isLoggingOut = false;
  isSidebarOpen = true;
  statusMessage = '';

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  logout(): void {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;
    this.statusMessage = '';

    this.authCommandService.handleSignOut().subscribe({
      next: () => this.clearSessionAndNavigate('Session closed successfully.'),
      error: () => this.clearSessionAndNavigate('Session closed locally after API logout issue.'),
    });
  }

  private clearSessionAndNavigate(message: string): void {
    this.tokenStorage.clearTokens();
    this.statusMessage = message;
    this.isLoggingOut = false;
    this.router.navigate(['/login']);
  }
}
