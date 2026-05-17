import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
  @Output() editRequested = new EventEmitter<void>();

  // Hardcoded thresholds for now
  thresholds = {
    pm25: { value: 60, unit: 'µg/m³' },
    co2: { value: 1000, unit: 'ppm' },
    temp: { value: 26, unit: '°C' },
    humidity: { value: 85, unit: '%' },
  };

  editThresholds(): void {
    this.editRequested.emit();
  }
}
