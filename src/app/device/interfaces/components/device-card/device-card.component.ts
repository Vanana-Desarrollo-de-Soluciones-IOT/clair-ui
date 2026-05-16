import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Device } from '../../../domain/services/device-query-service';

type ViewMode = 'grid' | 'list';

@Component({
  selector: 'app-device-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './device-card.component.html',
  styleUrl: './device-card.component.css',
})
export class DeviceCardComponent {
  @Input() device!: Device;
  @Input() viewMode: ViewMode = 'grid';

  statusColor(status: string): string {
    switch (status) {
      case 'ONLINE':
        return '#10b981';
      case 'OFFLINE':
        return '#6b7280';
      case 'MAINTENANCE':
        return '#f59e0b';
      case 'DECOMMISSIONED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }
}
