import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertsCardItem = Readonly<{
  id: string;
  message: string;
  severity: string;
  status: string;
  deviceName: string | null;
  spaceName: string | null;
  occurredAt: string;
}>;

@Component({
  selector: 'app-alerts-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts-card.component.html',
  styleUrls: ['./alerts-card.component.css'],
})
export class AlertsCardComponent {
  @Input() title = 'Alerts';
  @Input() subtitle = 'Per organization';
  @Input() alerts: AlertsCardItem[] = [];
  @Input() emptyLabel = 'No alerts available';

  get hasAlerts(): boolean {
    return Array.isArray(this.alerts) && this.alerts.length > 0;
  }

  getAlertLabel(alert: AlertsCardItem): string {
    return alert.spaceName?.trim() || alert.deviceName?.trim() || alert.message || '--';
  }

  getAlertTime(alert: AlertsCardItem): string {
    if (!alert.occurredAt) return '--';
    const parsed = new Date(alert.occurredAt);
    if (Number.isNaN(parsed.getTime())) return '--';
    const diffSeconds = Math.max(0, Math.floor((Date.now() - parsed.getTime()) / 1000));
    if (diffSeconds < 60) return `${diffSeconds}s`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h`;
  }

  getSeverityClass(alert: AlertsCardItem): string {
    const severity = (alert.severity || '').toUpperCase();
    if (severity === 'HIGH' || severity === 'CRITICAL') return 'dot danger';
    if (severity === 'MEDIUM') return 'dot warning';
    return 'dot info';
  }
}

