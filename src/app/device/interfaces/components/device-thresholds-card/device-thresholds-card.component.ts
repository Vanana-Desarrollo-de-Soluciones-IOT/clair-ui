import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DeviceTelemetrySnapshot } from '../../../application/internal/outboundservices/acl/external-telemetry-evaluation.service';

@Component({
  selector: 'app-device-thresholds-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './device-thresholds-card.component.html',
  styleUrl: './device-thresholds-card.component.css',
})
export class DeviceThresholdsCardComponent {
  @Input() deviceId: string = '';
  @Input() telemetry: DeviceTelemetrySnapshot | null = null;
  @Output() editRequested = new EventEmitter<void>();

  // Hardcoded values
  pm2_5 = 15;
  co2 = 450;
  temperature = 22;
  humidity = 40;

  editThresholds(): void {
    this.editRequested.emit();
  }
}
