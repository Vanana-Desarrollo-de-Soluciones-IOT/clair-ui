import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ClairLogoComponent } from '../../../../shared/interfaces/components/clair-logo/clair-logo.component';
import { AuthCommandServiceImpl } from '../../../application/internal/commandservices/auth-command-service.impl';
import { createEmail } from '../../../domain/model/valueobjects/email.value-object';
import { createPassword } from '../../../domain/model/valueobjects/password.value-object';
import { createSignInCommand } from '../../../domain/model/commands/sign-in.command';
import { TokenStorageGateway, TOKEN_STORAGE_GATEWAY } from '../../../infrastructure/storage/token-storage.gateway';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    RouterLink,
    ClairLogoComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authCommandService = inject(AuthCommandServiceImpl);
  private readonly tokenStorage = inject(TOKEN_STORAGE_GATEWAY);
  private readonly router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  loading = false;
  errorMessage: string | null = null;
  hidePassword = true;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    try {
      const emailVo = createEmail(email);
      const passwordVo = createPassword(password);
      const command = createSignInCommand(emailVo, passwordVo);

      console.log('[Login] Sending sign-in request...', { email });

      this.authCommandService.handleSignIn(command).subscribe({
        next: (result) => {
          console.log('[Login] Success');
          this.loading = false;
          this.tokenStorage.setTokens(result.accessToken.value, result.refreshToken.value);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('[Login] Error:', err);
          this.loading = false;
          if (err.status === 401) {
            this.errorMessage = 'Invalid email or password.';
          } else if (err.status === 0) {
            this.errorMessage = 'Cannot connect to server. Is the backend running?';
          } else {
            this.errorMessage = err?.error?.message || 'An unexpected error occurred. Please try again.';
          }
        },
      });
    } catch (err: any) {
      console.error('[Login] Validation error:', err);
      this.loading = false;
      this.errorMessage = err.message || 'Validation error';
    }
  }

}
