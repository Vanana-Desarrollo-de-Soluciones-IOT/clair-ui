import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface EditOrganizationDialogData {
  currentName: string;
}

@Component({
  selector: 'app-edit-organization-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './edit-organization-dialog.component.html',
  styleUrl: './edit-organization-dialog.component.css',
})
export class EditOrganizationDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EditOrganizationDialogComponent>);
  private readonly fb = inject(FormBuilder);
  readonly data: EditOrganizationDialogData = inject(MAT_DIALOG_DATA);

  form: FormGroup = this.fb.group({
    name: [this.data.currentName ?? '', [Validators.required, Validators.minLength(1)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value.name as string);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
