import { Component, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-premium-plan-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './premium-plan-card.component.html',
  styleUrl: './premium-plan-card.component.css',
  host: { class: 'block' }
})
export class PremiumPlanCardComponent {
  @Output() onSelect = new EventEmitter<void>();

  onPress() {
    this.onSelect.emit();
  }
}
