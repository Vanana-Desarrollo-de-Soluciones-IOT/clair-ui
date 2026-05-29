import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aqi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aqi-card.component.html',
  styleUrl: './aqi-card.component.css',
})
export class AqiCardComponent {
  @Input() aqiValue: number | null = null;
  @Input() aqiCategory: string | null = null;
  @Input() updatedAt: string | null = null;
  @Input() organizationCount: number | null = null;
  @Input() maxAqiValue = 100;

  get displayAqiValue(): string | number {
    return this.aqiValue === null || !Number.isFinite(this.aqiValue)
      ? '--'
      : Math.round(this.aqiValue);
  }

  get displayCategory(): string {
    return this.aqiCategory && this.aqiCategory.trim().length > 0
      ? this.aqiCategory
      : '--';
  }

  get progressPercent(): number {
    if (this.aqiValue === null || !Number.isFinite(this.aqiValue)) {
      return 0;
    }
    const max = this.maxAqiValue > 0 ? this.maxAqiValue : 100;
    return Math.min(100, Math.max(0, Math.round((this.aqiValue / max) * 100)));
  }

  get organizationLabel(): string {
    if (this.organizationCount === null || this.organizationCount === undefined) {
      return '-- organization';
    }
    const label = this.organizationCount === 1 ? 'organization' : 'organizations';
    return `${this.organizationCount} ${label}`;
  }

  get updatedLabel(): string {
    if (!this.updatedAt) {
      return 'Updated --';
    }
    const parsed = new Date(this.updatedAt);
    if (Number.isNaN(parsed.getTime())) {
      return 'Updated --';
    }
    const diffSeconds = Math.max(
      0,
      Math.floor((Date.now() - parsed.getTime()) / 1000),
    );
    return `Updated ${diffSeconds} seconds ago`;
  }
}

