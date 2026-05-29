import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Subscription, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/interfaces/components/header/header.component';
import { ExternalDeviceService } from '../../../application/internal/outboundservices/acl/external-device.service';
import { ExternalTelemetryService } from '../../../application/internal/outboundservices/acl/external-telemetry.service';
import { AnalyticsQueryServiceImpl } from '../../../application/internal/queryservices/analytics-query-service.impl';
import {
  FacadeOrganization,
  FacadeSpace,
  FacadeDevice,
} from '../../../../device/interfaces/acl/device-context-facade';
import { DashboardMetrics } from '../../../domain/services/analytics-query-service';
import { TrendPoint } from '../../../domain/model/valueobjects/trend-point.value-object';
import { LatestTelemetrySummary } from '../../../../evaluation/interfaces/acl/evaluation-context-facade';
import { createGetDashboardMetricsQuery } from '../../../domain/model/queries/get-dashboard-metrics.query';
import { createGetTrendsQuery } from '../../../domain/model/queries/get-trends.query';
import {
  getAqiColor,
  getProgressOffset,
  getPm25StatusColor,
  getCo2StatusColor,
  getTempStatusColor,
  getHumidityStatusColor,
  getActiveMetricDelta,
  formatUpdateTime,
} from '../../rest/transform/analytics-page.transform';

// Reusable Components
import { AqiGaugeCardComponent } from '../../components/aqi-gauge-card/aqi-gauge-card.component';
import { MetricCardComponent } from '../../components/metric-card/metric-card.component';
import { TrendChartCardComponent } from '../../components/trend-chart-card/trend-chart-card.component';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    SidebarComponent,
    HeaderComponent,
    AqiGaugeCardComponent,
    MetricCardComponent,
    TrendChartCardComponent,
  ],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.css',
})
export class AnalyticsPageComponent implements OnInit, OnDestroy {
  private readonly deviceAclService = inject(ExternalDeviceService);
  private readonly telemetryAclService = inject(ExternalTelemetryService);
  private readonly analyticsQueryService = inject(AnalyticsQueryServiceImpl);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  isSidebarOpen = true;
  loading = false;
  error: string | null = null;
  liveUnavailable = false;
  liveUnavailableMessage = '';

  // Dropdown data
  organizations: FacadeOrganization[] = [];
  spaces: FacadeSpace[] = [];
  devices: FacadeDevice[] = [];

  // Dropdown selections
  selectedOrgId = '';
  selectedSpaceId = '';
  selectedDeviceId = '';

  // Telemetry & analytics data
  liveData: DashboardMetrics | null = null;
  trendDataPoints: TrendPoint[] = [];
  lastReadings: LatestTelemetrySummary | null = null;

  // Controls
  selectedPeriod = 'LIVE';
  selectedMetric = 'aqiValue';

  // Custom Date range
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Refresher tracking
  secondsSinceUpdate = 0;
  private refreshSubscription?: Subscription;
  private secondsCounterSubscription?: Subscription;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  ngOnInit(): void {
    this.loadOrganizations();
    this.startSecondsCounter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopPolling();
    if (this.secondsCounterSubscription) {
      this.secondsCounterSubscription.unsubscribe();
    }
  }

  private loadOrganizations(): void {
    this.loading = true;
    this.deviceAclService
      .fetchOrganizations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orgs) => {
          this.organizations = orgs;
          if (orgs.length > 0) {
            this.selectedOrgId = orgs[0].id;
            this.onOrgChange();
          } else {
            this.loading = false;
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          this.error = 'Failed to load organizations. Please try again.';
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onOrgChange(): void {
    this.resetSelections('ORG');
    if (!this.selectedOrgId) {
      this.cdr.markForCheck();
      return;
    }

    this.deviceAclService
      .fetchSpacesByOrganization(this.selectedOrgId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (spaces) => {
          this.spaces = spaces;
          if (spaces.length > 0) {
            this.selectedSpaceId = spaces[0].id;
            this.onSpaceChange();
          } else {
            this.loading = false;
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          this.error = 'Failed to load spaces.';
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onSpaceChange(): void {
    this.resetSelections('SPACE');
    if (!this.selectedSpaceId) {
      this.cdr.markForCheck();
      return;
    }

    this.deviceAclService
      .fetchDevicesBySpace(this.selectedSpaceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (devices) => {
          this.devices = devices;
          if (devices.length > 0) {
            this.selectedDeviceId = devices[0].id;
            this.onDeviceChange();
          } else {
            this.loading = false;
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          this.error = 'Failed to load devices.';
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onDeviceChange(): void {
    this.resetSelections('DEVICE');
    if (!this.selectedDeviceId) {
      this.cdr.markForCheck();
      return;
    }

    this.fetchData();
    this.startPolling();
  }

  private resetSelections(level: 'ORG' | 'SPACE' | 'DEVICE'): void {
    if (level === 'ORG') {
      this.spaces = [];
      this.selectedSpaceId = '';
    }
    if (level === 'ORG' || level === 'SPACE') {
      this.devices = [];
      this.selectedDeviceId = '';
    }
    this.liveData = null;
    this.trendDataPoints = [];
    this.lastReadings = null;
    this.liveUnavailable = false;
    this.liveUnavailableMessage = '';
    this.stopPolling();
  }

  fetchData(): void {
    if (!this.selectedDeviceId) return;

    this.loading = true;
    this.error = null;
    this.liveUnavailable = false;

    const startIso = this.selectedPeriod === 'CUSTOM' && this.startDate ? this.startDate.toISOString() : undefined;
    const endIso = this.selectedPeriod === 'CUSTOM' && this.endDate ? this.endDate.toISOString() : undefined;
    const apiPeriod = this.selectedPeriod === 'CUSTOM' ? undefined : this.selectedPeriod;

    // Metrics
    const metricsQuery = createGetDashboardMetricsQuery(this.selectedDeviceId, apiPeriod, startIso, endIso);
    this.analyticsQueryService
      .handleGetDashboardMetrics(metricsQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (metrics) => {
          this.liveData = metrics;
          this.secondsSinceUpdate = 0;
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          this.liveData = null;
          if (err?.status === 404) {
            this.liveUnavailable = true;
            const deviceName = this.devices.find((d) => d.id === this.selectedDeviceId)?.name || 'Device';
            this.liveUnavailableMessage = (err?.error?.message || 'Live data is not available right now.').replace(this.selectedDeviceId, `"${deviceName}"`);
          }
          this.cdr.markForCheck();
        },
      });

    // Trends
    const apiTrendPeriod = this.selectedPeriod === 'LIVE' ? 'DAY' : this.selectedPeriod === 'CUSTOM' ? undefined : this.selectedPeriod.toUpperCase();
    const trendsQuery = createGetTrendsQuery(this.selectedDeviceId, apiTrendPeriod, startIso, endIso);
    this.analyticsQueryService
      .handleGetTrends(trendsQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (trends) => {
          this.trendDataPoints = trends;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.trendDataPoints = [];
          this.loading = false;
          this.cdr.markForCheck();
        },
      });

    // Latest Readings
    this.telemetryAclService
      .fetchLatestTelemetryByDevice(this.selectedDeviceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (telemetry) => {
          this.lastReadings = telemetry;
          this.cdr.markForCheck();
        },
        error: () => {
          this.lastReadings = null;
          this.cdr.markForCheck();
        },
      });
  }

  private startPolling(): void {
    this.stopPolling();
    this.refreshSubscription = interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetchData());
  }

  private stopPolling(): void {
    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = undefined;
  }

  private startSecondsCounter(): void {
    this.secondsCounterSubscription = interval(1000).subscribe(() => {
      this.secondsSinceUpdate++;
      this.cdr.markForCheck();
    });
  }

  selectPeriod(period: string): void {
    this.selectedPeriod = period;
    this.startDate = null;
    this.endDate = null;
    this.fetchData();
    this.startPolling();
  }

  onStartDateChange(event: any): void {
    this.startDate = event.value;
  }

  onEndDateChange(event: any): void {
    this.endDate = event.value;
    if (this.startDate && this.endDate) {
      this.selectedPeriod = 'CUSTOM';
      this.fetchData();
      this.startPolling();
    }
  }

  selectMetric(metric: string): void {
    this.selectedMetric = metric;
    this.cdr.markForCheck();
  }

  // Getters using transformers
  get aqiValue(): number | string {
    return this.liveData?.aqi.value ?? '--';
  }

  get aqiCategory(): string {
    return this.liveData?.aqi.category ?? 'No measurements';
  }

  get formattedUpdateTime(): string {
    return formatUpdateTime(this.secondsSinceUpdate);
  }

  get pm25StatusColor(): string {
    return getPm25StatusColor(this.liveData?.pm2_5.value);
  }

  get co2StatusColor(): string {
    return getCo2StatusColor(this.liveData?.co2.value);
  }

  get tempStatusColor(): string {
    return getTempStatusColor(this.liveData?.temperature.value);
  }

  get humidityStatusColor(): string {
    return getHumidityStatusColor(this.liveData?.humidity.value);
  }

  get activeMetricDelta(): number | null {
    return getActiveMetricDelta(this.liveData, this.selectedMetric);
  }
}
