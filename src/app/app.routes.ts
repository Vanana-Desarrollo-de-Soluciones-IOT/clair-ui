import { Routes } from '@angular/router';
import { LoginPageComponent } from './iam/interfaces/pages/login-page/login-page.component';
import { RegisterPageComponent } from './iam/interfaces/pages/register-page/register-page.component';
import { ConfirmPageComponent } from './iam/interfaces/pages/confirm-page/confirm-page.component';
import { HomePageComponent } from './iam/interfaces/pages/home-page/home-page.component';
import { authGuard } from './iam/interfaces/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'confirm', component: ConfirmPageComponent },
  { path: 'home', component: HomePageComponent, canActivate: [authGuard] },
];
