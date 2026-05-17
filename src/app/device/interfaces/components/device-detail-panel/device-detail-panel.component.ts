import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { ClairDeviceComponent } from '../../../../shared/interfaces/components/clair-device/clair-device.component';
import { Device } from '../../../domain/services/device-query-service';

@Component({
  selector: 'app-device-detail-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    ClairDeviceComponent,
  ],
  templateUrl: './device-detail-panel.component.html',
  styleUrl: './device-detail-panel.component.css',
})
export class DeviceDetailPanelComponent {
  @Input() device!: Device;
  @Output() backRequested = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<void>();
  @Output() powerToggleRequested = new EventEmitter<void>();

  // Hardcoded metrics for now
  metrics = {
    connectivity: -60,
    uptime: 101,
    health: 92,
    lastUpdate: 2,
    network: 'A101',
    location: 'A101',
  };

  thresholds = {
    pm25: 60,
    co2: 1000,
    temp: 26,
    humidity: 85,
  };

  goBack(): void {
    this.backRequested.emit();
  }

  togglePower(): void {
    this.powerToggleRequested.emit();
  }

  editDevice(): void {
    this.editRequested.emit();
  }

  deleteDevice(): void {
    this.deleteRequested.emit();
  }

  getStatusColor(): string {
    switch (this.device.status) {
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

  getConnectivityValue(): number {
    return Math.abs(this.metrics.connectivity);
  }
}
