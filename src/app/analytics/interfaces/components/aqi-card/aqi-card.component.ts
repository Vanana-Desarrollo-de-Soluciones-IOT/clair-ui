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

  private normalizeCategory(raw: string): string {
    return raw
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, '_')
      .replace(/_+/g, '_');
  }

  private getCategoryKey(): string | null {
    const raw = (this.aqiCategory || '').trim();
    if (raw) return this.normalizeCategory(raw);
    if (this.aqiValue === null || !Number.isFinite(this.aqiValue)) return null;
    const value = Math.round(this.aqiValue);
    if (value <= 50) return 'GOOD';
    if (value <= 100) return 'MODERATE';
    if (value <= 150) return 'UNHEALTHY_FOR_SENSITIVE';
    if (value <= 200) return 'UNHEALTHY';
    if (value <= 300) return 'VERY_UNHEALTHY';
    return 'HAZARDOUS';
  }

  get displayAqiValue(): string | number {
    return this.aqiValue === null || !Number.isFinite(this.aqiValue)
      ? '--'
      : Math.round(this.aqiValue);
  }

  get displayCategory(): string {
    const key = this.getCategoryKey();
    if (!key) return '--';
    return key.replace(/_/g, ' ');
  }

  get toneClass(): string {
    const key = this.getCategoryKey();
    if (!key) return 'neutral';
    if (key === 'GOOD') return 'good';
    if (key === 'MODERATE') return 'moderate';
    if (key === 'UNHEALTHY_FOR_SENSITIVE') return 'sensitive';
    if (key === 'UNHEALTHY_FOR_SENSITIVE_GROUPS') return 'sensitive';
    if (key === 'UNHEALTHY') return 'unhealthy';
    if (key === 'VERY_UNHEALTHY') return 'very-unhealthy';
    if (key === 'HAZARDOUS') return 'hazardous';
    return 'neutral';
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
