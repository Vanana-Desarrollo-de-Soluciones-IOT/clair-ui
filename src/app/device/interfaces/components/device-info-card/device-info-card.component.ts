import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { ClairDeviceComponent } from '../../../../shared/interfaces/components/clair-device/clair-device.component';
import { Device } from '../../../domain/services/device-query-service';
import { DeviceTelemetrySnapshot } from '../../../application/internal/outboundservices/acl/external-telemetry-evaluation.service';

@Component({
  selector: 'app-device-info-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    ClairDeviceComponent,
  ],
  templateUrl: './device-info-card.component.html',
  styleUrl: './device-info-card.component.css',
})
export class DeviceInfoCardComponent {
  @Input() device!: Device;
  @Input() telemetry: DeviceTelemetrySnapshot | null = null;
  @Output() backRequested = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<void>();
  @Output() powerToggleRequested = new EventEmitter<void>();

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
      case 'STANDBY':
        return '#6b7280';
      case 'OFFLINE':
        return '#6b7280';
      case 'MAINTENANCE':
        return '#f59e0b';
      case 'ERROR':
        return '#ef4444';
      case 'DECOMMISSIONED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  getPowerButtonVariant(): 'on' | 'off' {
    return this.isDeviceLikelyAwake() ? 'on' : 'off';
  }

  getConnectivityColor(): string {
    if (!this.telemetry) return '#9ca3af';

    const status = (this.telemetry.connectivityStatus ?? '').trim().toUpperCase();
    const signalStrength = this.telemetry.connectivitySignalStrength;
    if (!status) return '#9ca3af';

    const isConnected = status.includes('CONNECTED') || status.includes('ONLINE') || status.includes('UP');
    if (!isConnected) return '#6b7280';
    if (signalStrength == null) return '#10b981';

    if (signalStrength >= -70) return '#10b981';
    if (signalStrength >= -85) return '#f59e0b';
    return '#ef4444';
  }

  getConnectivityValue(): number | null {
    if (this.telemetry?.connectivitySignalStrength != null) {
      return Math.abs(this.telemetry.connectivitySignalStrength);
    }
    return null;
  }

  private isDeviceLikelyAwake(): boolean {
    if (this.device.status === 'ONLINE') return true;
    if (!this.telemetry) return false;
    const recent = this.telemetry.lastUpdateMinutes != null && this.telemetry.lastUpdateMinutes <= 2;

    const status = (this.telemetry.connectivityStatus ?? '').trim().toUpperCase();
    const isConnected = status.includes('CONNECTED') || status.includes('ONLINE') || status.includes('UP');

    return recent && isConnected;
  }
}
