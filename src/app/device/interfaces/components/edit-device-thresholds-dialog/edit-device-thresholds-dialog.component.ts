import { AfterViewInit, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { DeviceThresholdQueryServiceImpl } from '../../../application/internal/queryservices/device-threshold-query-service.impl';
import { DeviceThresholdCommandServiceImpl } from '../../../application/internal/commandservices/device-threshold-command-service.impl';
import { extractApiErrorMessage } from '../../rest/transform/extract-api-error-message.transform';
import { DeviceThreshold } from '../../../domain/services/device-threshold-query-service';
import { MetricThreshold, METRIC_THRESHOLDS, getMetricThresholdDetails } from '../../../domain/model/valueobjects/metric-threshold.value-object';
import { createDeviceId } from '../../../domain/model/valueobjects/device-id.value-object';
import { createGetDeviceThresholdsByDeviceQuery } from '../../../domain/model/queries/get-device-thresholds-by-device.query';
import { createCreateDeviceThresholdCommand } from '../../../domain/model/commands/create-device-threshold.command';
import { createUpdateDeviceThresholdCommand } from '../../../domain/model/commands/update-device-threshold.command';

export type EditDeviceThresholdsDialogData = Readonly<{
  deviceId: string;
}>;

type SliderMetricConfig = Readonly<{
  metric: MetricThreshold;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}>;

@Component({
  selector: 'app-edit-device-thresholds-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
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
  readonly metricDetails = getMetricThresholdDetails;

  loading = false;
  saving = false;

  thresholdsByMetric: Partial<Record<MetricThreshold, DeviceThreshold>> = {};
  private initialThresholdsByMetric: Partial<Record<MetricThreshold, DeviceThreshold>> = {};

  readonly sliderConfigs: readonly SliderMetricConfig[] = [
    { metric: 'PM25', min: 1, max: 250, step: 1, defaultValue: 60 },
    { metric: 'CO2', min: 100, max: 5000, step: 10, defaultValue: 1000 },
    { metric: 'TEMPERATURE', min: 5, max: 60, step: 0.1, defaultValue: 28.7 },
    { metric: 'HUMIDITY', min: 1, max: 100, step: 1, defaultValue: 80 },
  ] as const;

  form: FormGroup = this.fb.group(
    this.sliderConfigs.reduce<Record<string, FormGroup>>((acc, cfg) => {
      acc[cfg.metric] = this.fb.group({
        value: [cfg.defaultValue, [Validators.required, Validators.min(cfg.min), Validators.max(cfg.max)]],
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

  getSliderConfig(metric: MetricThreshold): SliderMetricConfig {
    return this.sliderConfigs.find((c) => c.metric === metric) as SliderMetricConfig;
  }

  getMetricValue(metric: MetricThreshold): number {
    const raw = this.getMetricForm(metric).get('value')?.value as number;
    return Number(raw);
  }

  getSliderPercent(metric: MetricThreshold): number {
    const cfg = this.getSliderConfig(metric);
    const value = this.getMetricValue(metric);
    const percent = ((value - cfg.min) / (cfg.max - cfg.min)) * 100;
    return Math.max(0, Math.min(100, percent));
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
          this.initialThresholdsByMetric = { ...this.thresholdsByMetric };

          this.sliderConfigs.forEach((cfg) => {
            const existing = this.thresholdsByMetric[cfg.metric] ?? null;
            const group = this.getMetricForm(cfg.metric);
            const nextValue = existing ? existing.value : cfg.defaultValue;
            group.patchValue({ value: nextValue }, { emitEvent: false });
          });
        },
        error: (error) => {
          this.snackBar.open(extractApiErrorMessage(error, 'Failed to load thresholds'), 'Close', { duration: 3500 });
        },
      });
  }

  reset(): void {
    this.sliderConfigs.forEach((cfg) => {
      const existing = this.initialThresholdsByMetric[cfg.metric] ?? null;
      const nextValue = existing ? existing.value : cfg.defaultValue;
      this.getMetricForm(cfg.metric).patchValue({ value: nextValue }, { emitEvent: false });
      this.getMetricForm(cfg.metric).markAsPristine();
      this.getMetricForm(cfg.metric).markAsUntouched();
    });
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    let deviceId;
    try {
      deviceId = createDeviceId(this.data.deviceId);
    } catch (error) {
      this.snackBar.open(extractApiErrorMessage(error, 'Invalid device id'), 'Close', { duration: 3500 });
      return;
    }

    this.saving = true;

    const writes$ = this.sliderConfigs.map((cfg) => {
      const value = this.getMetricValue(cfg.metric);
      const operator = 'GREATER_THAN';
      const enabled = true;

      const request$ = this.hasThreshold(cfg.metric)
        ? this.commandService.handleUpdateDeviceThreshold(createUpdateDeviceThresholdCommand(deviceId, cfg.metric, operator, value, enabled))
        : this.commandService.handleCreateDeviceThreshold(createCreateDeviceThresholdCommand(deviceId, cfg.metric, operator, value, enabled));

      return request$.pipe(
        tap((saved) => {
          this.thresholdsByMetric[cfg.metric] = saved;
        })
      );
    });

    forkJoin(writes$)
      .pipe(
        map(() => true),
        switchMap(() => this.queryService.handleGetDeviceThresholdsByDevice(createGetDeviceThresholdsByDeviceQuery(deviceId))),
        finalize(() => (this.saving = false))
      )
      .subscribe({
        next: (thresholds) => {
          this.thresholdsByMetric = thresholds.reduce<Partial<Record<MetricThreshold, DeviceThreshold>>>((acc, t) => {
            acc[t.metric] = t;
            return acc;
          }, {});
          this.initialThresholdsByMetric = { ...this.thresholdsByMetric };
          this.form.markAsPristine();
          this.snackBar.open('Thresholds saved', 'Close', { duration: 2500 });
          this.done();
        },
        error: (error) => {
          this.snackBar.open(extractApiErrorMessage(error, 'Failed to save thresholds'), 'Close', { duration: 3500 });
        },
      });
  }
}
