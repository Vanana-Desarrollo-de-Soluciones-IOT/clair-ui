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
    const days = this.buildLastNDays(this.daysToShow);
    const countsByDate = new Map((this.data ?? []).map((d) => [d.date, d.count] as const));
    const series = days.map((isoDate) => ({
      date: isoDate,
      count: countsByDate.get(isoDate) ?? 0,
    }));

    const maxCount = Math.max(...series.map((d) => d.count), 1);
    return series.map((d) => {
      const rawHeight = (d.count / maxCount) * 100;
      const heightPct = d.count === 0 ? 2 : Math.max(rawHeight, 6);
      return {
        label: d.date.slice(5),
        heightPct,
        color: this.barColor(d.count),
      };
    });
  }

  private buildLastNDays(days: number): string[] {
    const out: string[] = [];
    const now = new Date();
    // Work in UTC so it matches backend's UTC grouping.
    const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(todayUtc);
      d.setUTCDate(d.getUTCDate() - i);
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
  }

  private barColor(count: number): string {
    if (count <= 3) return '#10b981';
    if (count <= 7) return '#f59e0b';
    return '#ef4444';
  }
}
