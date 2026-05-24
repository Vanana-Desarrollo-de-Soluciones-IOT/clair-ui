import { AfterViewInit, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { DeviceThresholdQueryServiceImpl } from '../../../application/internal/queryservices/device-threshold-query-service.impl';
import { DeviceThresholdCommandServiceImpl } from '../../../application/internal/commandservices/device-threshold-command-service.impl';
import { extractApiErrorMessage } from '../../rest/transform/extract-api-error-message.transform';
import { DeviceThreshold } from '../../../domain/services/device-threshold-query-service';
import { MetricThreshold, METRIC_THRESHOLDS, getMetricThresholdDetails } from '../../../domain/model/valueobjects/metric-threshold.value-object';
import { ThresholdOperator, THRESHOLD_OPERATORS, getThresholdOperatorSymbol } from '../../../domain/model/valueobjects/threshold-operator.value-object';
import { createDeviceId } from '../../../domain/model/valueobjects/device-id.value-object';
import { createGetDeviceThresholdsByDeviceQuery } from '../../../domain/model/queries/get-device-thresholds-by-device.query';
import { createCreateDeviceThresholdCommand } from '../../../domain/model/commands/create-device-threshold.command';
import { createUpdateDeviceThresholdCommand } from '../../../domain/model/commands/update-device-threshold.command';
import { createDeleteDeviceThresholdCommand } from '../../../domain/model/commands/delete-device-threshold.command';

export type EditDeviceThresholdsDialogData = Readonly<{
  deviceId: string;
}>;

type MetricFormValue = Readonly<{
  enabled: boolean;
  operator: ThresholdOperator;
  value: number | null;
}>;

@Component({
  selector: 'app-edit-device-thresholds-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit-device-thresholds-dialog.component.html',
  styleUrl: './edit-device-thresholds-dialog.component.css',
})
export class EditDeviceThresholdsDialogComponent implements AfterViewInit {
  private readonly dialogRef = inject(MatDialogRef<EditDeviceThresholdsDialogComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly queryService = inject(DeviceThresholdQueryServiceImpl);
  private readonly commandService = inject(DeviceThresholdCommandServiceImpl);
  readonly data: EditDeviceThresholdsDialogData = inject(MAT_DIALOG_DATA);

  readonly metrics = METRIC_THRESHOLDS;
  readonly operators = THRESHOLD_OPERATORS;
  readonly operatorSymbol = getThresholdOperatorSymbol;
  readonly metricDetails = getMetricThresholdDetails;

  loading = false;
  savingByMetric: Partial<Record<MetricThreshold, boolean>> = {};
  deletingByMetric: Partial<Record<MetricThreshold, boolean>> = {};

  thresholdsByMetric: Partial<Record<MetricThreshold, DeviceThreshold>> = {};

  form: FormGroup = this.fb.group(
    this.metrics.reduce<Record<string, FormGroup>>((acc, metric) => {
      acc[metric] = this.fb.group({
        enabled: [true],
        operator: ['GREATER_THAN' as ThresholdOperator, [Validators.required]],
        value: [null as number | null, [Validators.required, Validators.min(0.0000001)]],
      });
      return acc;
    }, {})
  );

  ngAfterViewInit(): void {
    setTimeout(() => this.reload());
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  done(): void {
    this.dialogRef.close(true);
  }

  hasThreshold(metric: MetricThreshold): boolean {
    return Boolean(this.thresholdsByMetric[metric]);
  }

  getMetricForm(metric: MetricThreshold): FormGroup {
    return this.form.get(metric) as FormGroup;
  }

  private getMetricFormValue(metric: MetricThreshold): MetricFormValue {
    const group = this.getMetricForm(metric);
    const enabled = Boolean(group.get('enabled')?.value);
    const operator = group.get('operator')?.value as ThresholdOperator;
    const rawValue = group.get('value')?.value as number | null;
    const value = rawValue === null || rawValue === undefined ? null : Number(rawValue);
    return { enabled, operator, value };
  }

  private reload(): void {
    this.loading = true;
    let deviceId;
    try {
      deviceId = createDeviceId(this.data.deviceId);
    } catch (error) {
      this.loading = false;
      this.snackBar.open(extractApiErrorMessage(error, 'Invalid device id'), 'Close', { duration: 3500 });
      return;
    }
    this.queryService
      .handleGetDeviceThresholdsByDevice(createGetDeviceThresholdsByDeviceQuery(deviceId))
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (thresholds) => {
          this.thresholdsByMetric = thresholds.reduce<Partial<Record<MetricThreshold, DeviceThreshold>>>((acc, t) => {
            acc[t.metric] = t;
            return acc;
          }, {});

          this.metrics.forEach((metric) => {
            const existing = this.thresholdsByMetric[metric] ?? null;
            const group = this.getMetricForm(metric);
            if (existing) {
              group.patchValue({ enabled: existing.enabled, operator: existing.operator, value: existing.value }, { emitEvent: false });
            } else {
              group.patchValue({ enabled: true, operator: 'GREATER_THAN', value: null }, { emitEvent: false });
            }
          });
        },
        error: (error) => {
          this.snackBar.open(extractApiErrorMessage(error, 'Failed to load thresholds'), 'Close', { duration: 3500 });
        },
      });
  }

  saveMetric(metric: MetricThreshold): void {
    const group = this.getMetricForm(metric);
    group.markAllAsTouched();
    if (group.invalid) return;

    const formValue = this.getMetricFormValue(metric);
    if (formValue.value === null) return;

    this.savingByMetric[metric] = true;
    const deviceId = createDeviceId(this.data.deviceId);
    const request$ = this.hasThreshold(metric)
      ? this.commandService.handleUpdateDeviceThreshold(
          createUpdateDeviceThresholdCommand(deviceId, metric, formValue.operator, formValue.value, formValue.enabled)
        )
      : this.commandService.handleCreateDeviceThreshold(
          createCreateDeviceThresholdCommand(deviceId, metric, formValue.operator, formValue.value, formValue.enabled)
        );

    request$.pipe(finalize(() => (this.savingByMetric[metric] = false))).subscribe({
      next: (saved) => {
        this.thresholdsByMetric[metric] = saved;
        this.snackBar.open(`${this.metricDetails(metric).label} threshold saved`, 'Close', { duration: 2500 });
      },
      error: (error) => {
        this.snackBar.open(extractApiErrorMessage(error, 'Failed to save threshold'), 'Close', { duration: 3500 });
      },
    });
  }

  deleteMetric(metric: MetricThreshold): void {
    if (!this.hasThreshold(metric)) return;
    const ok = confirm(`Delete ${this.metricDetails(metric).label} threshold?`);
    if (!ok) return;

    this.deletingByMetric[metric] = true;
    const deviceId = createDeviceId(this.data.deviceId);

    this.commandService
      .handleDeleteDeviceThreshold(createDeleteDeviceThresholdCommand(deviceId, metric))
      .pipe(finalize(() => (this.deletingByMetric[metric] = false)))
      .subscribe({
        next: () => {
          delete this.thresholdsByMetric[metric];
          const group = this.getMetricForm(metric);
          group.patchValue({ enabled: true, operator: 'GREATER_THAN', value: null }, { emitEvent: false });
          this.snackBar.open(`${this.metricDetails(metric).label} threshold deleted`, 'Close', { duration: 2500 });
        },
        error: (error) => {
          this.snackBar.open(extractApiErrorMessage(error, 'Failed to delete threshold'), 'Close', { duration: 3500 });
        },
      });
  }
}
