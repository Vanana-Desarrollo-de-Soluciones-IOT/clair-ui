import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertSeverity } from '../../../domain/model/valueobjects/alert-severity.value-object';

@Component({
  selector: 'app-alert-severity-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [class]="severity.toLowerCase()">{{ severity }}</span>`,
  styleUrl: './alert-severity-badge.component.css',
})
export class AlertSeverityBadgeComponent {
  @Input() severity!: AlertSeverity;
}
