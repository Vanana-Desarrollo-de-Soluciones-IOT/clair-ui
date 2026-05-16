import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeviceCardComponent } from '../device-card/device-card.component';
import { Device, DevicePage } from '../../../domain/services/device-query-service';
import { Space } from '../../../domain/services/device-query-service';

export type DeviceViewMode = 'grid' | 'list';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, DeviceCardComponent],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.css',
})
export class DeviceListComponent {
  @Input() selectedSpace: Space | null = null;
  @Input() devicesPage: DevicePage | null = null;
  @Input() loadingDevices = false;
  @Input() errorDevices = '';
  @Input() viewMode: DeviceViewMode = 'grid';

  @Output() viewModeChanged = new EventEmitter<DeviceViewMode>();

  setViewMode(mode: DeviceViewMode): void {
    this.viewModeChanged.emit(mode);
  }
}
