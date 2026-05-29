import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { getAqiColor, getProgressOffset, formatDelta } from '../../rest/transform/analytics-page.transform';

@Component({
  selector: 'app-aqi-gauge-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="kpi-card aqi-card" [class.selected]="isSelected" (click)="cardClick.emit()">
      <div class="kpi-header">
        <span class="kpi-title">AIR QUALITY INDEX</span>
        <span class="status-badge" [style.background-color]="aqiColor" [style.color]="'#000'">
          {{ category | uppercase }}
        </span>
      </div>

      <div class="aqi-gauge-container">
        <svg class="aqi-gauge" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#222" stroke-width="8"></circle>
          <circle cx="50" cy="50" r="40" fill="transparent" [attr.stroke]="aqiColor" stroke-width="8"
            stroke-dasharray="251.2" [attr.stroke-dashoffset]="progressOffset" stroke-linecap="round"
            transform="rotate(-90 50 50)"></circle>
        </svg>
        <div class="aqi-value-center">
          <span class="aqi-number">{{ value }}</span>
        </div>
      </div>

      <div class="kpi-footer">
        <div class="trend-delta" [class.negative]="!isDeltaPositive">
          <ng-container *ngIf="delta !== null">
            <mat-icon>{{ isDeltaPositive ? 'trending_up' : 'trending_down' }}</mat-icon>
            <span>{{ formattedDelta }}</span>
          </ng-container>
          <span *ngIf="delta === null" class="delta-null">N/A</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./aqi-gauge-card.component.css'],
})
export class AqiGaugeCardComponent {
  @Input() value: number | string = '--';
  @Input() category = 'No measurements';
  @Input() delta: number | null = null;
  @Input() isSelected = false;
  @Output() cardClick = new EventEmitter<void>();

  get aqiColor(): string {
    return getAqiColor(typeof this.value === 'number' ? this.value : null);
  }

  get progressOffset(): number {
    return getProgressOffset(typeof this.value === 'number' ? this.value : null);
  }

  get isDeltaPositive(): boolean {
    return this.delta !== null && this.delta >= 0;
  }

  get formattedDelta(): string {
    return formatDelta(this.delta);
  }
}
