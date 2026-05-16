import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthCommandServiceImpl } from '../../../application/internal/commandservices/auth-command-service.impl';
import { createVerificationCode } from '../../../domain/model/valueobjects/verification-code.value-object';
import { createConfirmRegistrationCommand } from '../../../domain/model/commands/confirm-registration.command';

@Component({
  selector: 'app-confirm-page',
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
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './confirm-page.component.html',
  styleUrl: './confirm-page.component.css',
})
export class ConfirmPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authCommandService = inject(AuthCommandServiceImpl);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  confirmForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{4}-[A-Z0-9]{4}$')]],
  });

  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  sessionId: string | null = null;

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('sessionId');
    if (!this.sessionId) {
      this.errorMessage = 'Invalid registration session. Please register again.';
      this.snackBar.open(this.errorMessage, 'Close', { duration: 4000 });
    }
  }

  onSubmit(): void {
    if (this.confirmForm.invalid || !this.sessionId) {
      this.confirmForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const { code } = this.confirmForm.value;

    try {
      const codeVo = createVerificationCode(code);
      const command = createConfirmRegistrationCommand(this.sessionId, codeVo);

      this.authCommandService.handleConfirmRegistration(command).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Account verified successfully. Redirecting to login...';
          this.snackBar.open(this.successMessage, 'Close', { duration: 2500 });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Invalid verification code. Please try again.';
          this.snackBar.open(this.errorMessage ?? 'Invalid verification code. Please try again.', 'Close', { duration: 4000 });
        },
      });
    } catch (err: any) {
      this.loading = false;
      this.errorMessage = err.message || 'Validation error';
      this.snackBar.open(this.errorMessage ?? 'Validation error', 'Close', { duration: 4000 });
    }
  }
}
