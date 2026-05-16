import { Routes } from '@angular/router';
import { LoginPageComponent } from './iam/interfaces/pages/login-page/login-page.component';
import { RegisterPageComponent } from './iam/interfaces/pages/register-page/register-page.component';
import { ConfirmPageComponent } from './iam/interfaces/pages/confirm-page/confirm-page.component';
import { OverviewPageComponent } from './iam/interfaces/pages/overview-page/overview-page.component';
import { SettingsPageComponent } from './iam/interfaces/pages/settings-page/settings-page.component';
import { AuthCallbackPageComponent } from './iam/interfaces/pages/auth-callback-page/auth-callback-page.component';
import { authGuard } from './iam/interfaces/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'confirm', component: ConfirmPageComponent },
  { path: 'auth/callback', component: AuthCallbackPageComponent },
  { path: 'overview', component: OverviewPageComponent, canActivate: [authGuard] },
  { path: 'home', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'settings', component: SettingsPageComponent, canActivate: [authGuard] },
  { path: 'plans', loadComponent: () => import('./billing/interfaces/pages/select-plan/select-plan.component').then(c => c.SelectPlanComponent), canActivate: [authGuard] },
  { path: 'checkout', loadComponent: () => import('./billing/interfaces/pages/premium-checkout/premium-checkout.component').then(c => c.PremiumCheckoutComponent), canActivate: [authGuard] },
  { path: 'space-devices', loadComponent: () => import('./device/interfaces/pages/space-devices-page/space-devices-page.component').then(c => c.SpaceDevicesPageComponent), canActivate: [authGuard] },
  { path: 'select-plan', loadComponent: () => import('./billing/interfaces/pages/select-plan/select-plan.component').then(c => c.SelectPlanComponent), canActivate: [authGuard] },
  { path: 'checkout-premium', loadComponent: () => import('./billing/interfaces/pages/premium-checkout/premium-checkout.component').then(c => c.PremiumCheckoutComponent), canActivate: [authGuard] },
];
