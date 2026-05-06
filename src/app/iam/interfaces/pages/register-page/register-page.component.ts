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
import { ClairLogoComponent } from '../../../../shared/interfaces/components/clair-logo/clair-logo.component';
import { AuthCommandServiceImpl } from '../../../application/internal/commandservices/auth-command-service.impl';
import { createEmail } from '../../../domain/model/valueobjects/email.value-object';
import { createPassword } from '../../../domain/model/valueobjects/password.value-object';
import { createSignUpCommand } from '../../../domain/model/commands/sign-up.command';

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
    RouterLink,
    ClairLogoComponent,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authCommandService = inject(AuthCommandServiceImpl);
  private readonly router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  loading = false;
  errorMessage: string | null = null;
  hidePassword = true;
  hideConfirmPassword = true;

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    try {
      const emailVo = createEmail(email);
      const passwordVo = createPassword(password);
      const command = createSignUpCommand(emailVo, passwordVo);

      this.authCommandService.handleSignUp(command).subscribe({
        next: (result) => {
          this.loading = false;
          this.router.navigate(['/confirm'], { queryParams: { sessionId: result.sessionId } });
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
        },
      });
    } catch (err: any) {
      this.loading = false;
      this.errorMessage = err.message || 'Validation error';
    }
  }
}
