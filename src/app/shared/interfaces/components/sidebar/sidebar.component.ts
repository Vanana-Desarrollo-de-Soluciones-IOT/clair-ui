import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClairLyricsComponent } from '../clair-lyrics/clair-lyrics.component';

interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ClairLyricsComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly isOpen = signal(true);

  toggle(): void {
    this.isOpen.update(open => !open);
  }

  onNavItemClick(): void {
    if (window.innerWidth <= 768) {
      this.isOpen.set(false);
    }
  }

  readonly navItems: NavItem[] = [
    { label: 'Overview', icon: 'dashboard', active: true },
    { label: 'Air Quality', icon: 'air' },
    { label: 'Alerts & Actions', icon: 'warning_amber' },
    { label: 'Reports', icon: 'description' },
    { label: 'Space & Devices', icon: 'hub' },
  ];
}
