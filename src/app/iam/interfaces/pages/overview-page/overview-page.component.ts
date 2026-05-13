import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/interfaces/components/header/header.component';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, SidebarComponent, HeaderComponent],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.css',
})
export class OverviewPageComponent {
  isSidebarOpen = true;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
