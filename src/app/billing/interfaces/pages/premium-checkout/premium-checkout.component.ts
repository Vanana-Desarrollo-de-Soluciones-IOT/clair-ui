import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-premium-checkout',
  standalone: true,
  imports: [],
  templateUrl: './premium-checkout.component.html',
  styleUrl: './premium-checkout.component.css'
})
export class PremiumCheckoutComponent {
  autorenewDate: string;

  constructor(private location: Location) {
    const date = new Date();
    date.setDate(date.getDate() + 20);
    this.autorenewDate = date.toLocaleDateString('en-GB'); // dd/mm/yyyy format
  }

  goBack() {
    this.location.back();
  }

  onPress() {
    console.log('Action triggered');
  }
}
