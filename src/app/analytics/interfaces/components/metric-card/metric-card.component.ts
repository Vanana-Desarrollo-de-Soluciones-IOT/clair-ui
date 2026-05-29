import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { formatDelta, formatValue } from '../../rest/transform/analytics-page.transform';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="kpi-card parameter-card" [class.selected]="isSelected" (click)="cardClick.emit()">
      <div class="kpi-header">
        <span class="kpi-title">{{ title }}</span>
        <span class="indicator-dot" [style.background-color]="statusColor"></span>
      </div>
      <div class="kpi-body">
        <span class="kpi-value">{{ formattedValue }}</span>
        <span class="kpi-unit">{{ unit }}</span>
      </div>
      <div class="kpi-footer">
        <div class="trend-delta" [class.negative]="!isDeltaPositive">
          <ng-container *ngIf="delta !== null && delta !== undefined">
            <mat-icon>{{ isDeltaPositive ? 'trending_up' : 'trending_down' }}</mat-icon>
            <span>{{ formattedDelta }}</span>
          </ng-container>
          <span *ngIf="delta === null || delta === undefined" class="delta-null">N/A</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./metric-card.component.css'],
})
export class MetricCardComponent {
  @Input() title = '';
  @Input() value: number | null | undefined = null;
  @Input() unit = '';
  @Input() delta: number | null | undefined = null;
  @Input() statusColor = '#3a3a3c';
  @Input() isSelected = false;
  @Output() cardClick = new EventEmitter<void>();

  get formattedValue(): string {
    return formatValue(this.value);
  }

  get isDeltaPositive(): boolean {
    return this.delta !== null && this.delta !== undefined && this.delta >= 0;
  }

  get formattedDelta(): string {
    return formatDelta(this.delta);
  }
}
