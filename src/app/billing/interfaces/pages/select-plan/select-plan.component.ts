import { Component } from '@angular/core';
import { FreePlanCardComponent } from '../../components/free-plan-card/free-plan-card.component';
import { PremiumPlanCardComponent } from '../../components/premium-plan-card/premium-plan-card.component';

@Component({
  selector: 'app-select-plan',
  standalone: true,
  imports: [FreePlanCardComponent, PremiumPlanCardComponent],
  templateUrl: './select-plan.component.html',
  styleUrl: './select-plan.component.css'
})
export class SelectPlanComponent {
  onPress() {
    console.log('Plan selected');
  }
}
