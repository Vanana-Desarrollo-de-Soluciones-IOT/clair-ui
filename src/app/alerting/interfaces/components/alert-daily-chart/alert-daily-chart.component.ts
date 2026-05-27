import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyAlertCount } from '../../../domain/services/alert-query-service';

@Component({
  selector: 'app-alert-daily-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-daily-chart.component.html',
  styleUrl: './alert-daily-chart.component.css',
})
export class AlertDailyChartComponent {
  @Input() data: DailyAlertCount[] | null = null;

  readonly daysToShow = 30;

  get chartBars(): { label: string; heightPct: number; color: string }[] {
    if (!this.data || this.data.length === 0) return [];
    const maxCount = Math.max(...this.data.map((d) => d.count), 1);
    return this.data.map((d) => ({
      label: d.date.slice(5), // "04-27"
      heightPct: (d.count / maxCount) * 100,
      color: this.barColor(d.count),
    }));
  }

  private barColor(count: number): string {
    if (count <= 3) return '#10b981';
    if (count <= 7) return '#f59e0b';
    return '#ef4444';
  }
}
