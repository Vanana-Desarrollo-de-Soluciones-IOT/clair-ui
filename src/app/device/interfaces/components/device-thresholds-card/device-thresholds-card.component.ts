import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DeviceTelemetrySnapshot } from '../../../application/internal/outboundservices/acl/external-telemetry-evaluation.service';

@Component({
  selector: 'app-device-thresholds-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './device-thresholds-card.component.html',
  styleUrl: './device-thresholds-card.component.css',
})
export class DeviceThresholdsCardComponent {
  @Input() deviceId: string = '';
  @Input() telemetry: DeviceTelemetrySnapshot | null = null;
  @Output() editRequested = new EventEmitter<void>();

  editThresholds(): void {
    this.editRequested.emit();
  }
}
