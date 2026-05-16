import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AirQualityComponent } from '../icons/air-quality/air-quality.component';
import { AlertsActionsComponent } from '../icons/alerts-actions/alerts-actions.component';
import { OverviewComponent } from '../icons/overview/overview.component';
import { ReportsComponent } from '../icons/reports/reports.component';
import { SpaceDevicesComponent } from '../icons/space-devices/space-devices.component';

interface NavItem {
  label: string;
  component: string;
  route?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, AirQualityComponent, AlertsActionsComponent, OverviewComponent, ReportsComponent, SpaceDevicesComponent],
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
    { label: 'Overview', component: 'overview', route: '/overview' },
    { label: 'Air Quality', component: 'air-quality' },
    { label: 'Alerts & Actions', component: 'alerts-actions' },
    { label: 'Reports', component: 'reports' },
    { label: 'Space & Devices', component: 'space-devices', route: '/space-devices' },
  ];
}
