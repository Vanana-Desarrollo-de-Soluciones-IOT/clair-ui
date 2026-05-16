import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register-device-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register-device-dialog.component.html',
  styleUrl: './register-device-dialog.component.css',
})
export class RegisterDeviceDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<RegisterDeviceDialogComponent>);
  private readonly fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    serialNumber: ['', [Validators.required, Validators.minLength(1)]],
    name: ['', [Validators.required, Validators.minLength(1)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close({
      serialNumber: this.form.value.serialNumber as string,
      name: this.form.value.name as string,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
