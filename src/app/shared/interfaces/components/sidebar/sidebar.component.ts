import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Output() closeRequested = new EventEmitter<void>();

  onNavItemClick(): void {
    if (window.innerWidth <= 768) {
      this.closeRequested.emit();
    }
  }

  readonly navItems: NavItem[] = [
    { label: 'Overview', icon: 'dashboard', route: '/overview' },
    { label: 'Air Quality', icon: 'air' },
    { label: 'Alerts & Actions', icon: 'warning_amber' },
    { label: 'Reports', icon: 'description' },
    { label: 'Space & Devices', icon: 'hub' },
  ];
}
