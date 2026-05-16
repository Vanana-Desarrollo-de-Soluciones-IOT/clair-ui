import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Space } from '../../../domain/services/device-query-service';

@Component({
  selector: 'app-space-detail-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './space-detail-header.component.html',
  styleUrl: './space-detail-header.component.css',
})
export class SpaceDetailHeaderComponent {
  @Input() space: Space | null = null;
  @Output() registerDeviceRequested = new EventEmitter<void>();

  requestRegisterDevice(): void {
    this.registerDeviceRequested.emit();
  }
}
