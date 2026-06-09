import { Component, DestroyRef, inject } from '@angular/core';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClairLogoComponent } from '../../components/icons/clair-logo/clair-logo.component';
import { GoogleIconComponent } from '../../components/icons/google/google-icon.component';
import { AUTH_COMMAND_SERVICE, AuthCommandService } from '../../../domain/services/auth-command-service';
import { createEmail } from '../../../domain/model/valueobjects/email.value-object';
import { createPassword } from '../../../domain/model/valueobjects/password.value-object';
import { createSignUpCommand } from '../../../domain/model/commands/sign-up.command';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register-page',
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
    MatCheckboxModule,
    MatSnackBarModule,
    RouterLink,
    ClairLogoComponent,
    GoogleIconComponent,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authCommandService = inject(AUTH_COMMAND_SERVICE) as AuthCommandService;
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    acceptTerms: [false, [Validators.requiredTrue]],
  });

  loading = false;
  errorMessage: string | null = null;
  hidePassword = true;

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.registerForm.value;

    this.loading = true;
    this.errorMessage = null;

    try {
      const emailVo = createEmail(email);
      const passwordVo = createPassword(password);
      const command = createSignUpCommand(emailVo, passwordVo);

      this.authCommandService.handleSignUp(command).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (result) => {
          this.loading = false;
          this.snackBar.open('Registration successful. Check your email to confirm.', 'Close', { duration: 3000 });
          this.router.navigate(['/confirm'], { queryParams: { sessionId: result.sessionId } });
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
          this.snackBar.open(this.errorMessage ?? 'Registration failed. Please try again.', 'Close', { duration: 4000 });
        },
      });
    } catch (err: any) {
      this.loading = false;
      this.errorMessage = err.message || 'Validation error';
      this.snackBar.open(this.errorMessage ?? 'Validation error', 'Close', { duration: 4000 });
    }
  }

  onGoogleSignIn(): void {
    const authorizeUrl = this.authCommandService.getGoogleAuthorizeUrl();
    window.location.href = authorizeUrl;
  }
}
