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
import { FacadeOrganization, FacadeSpace, FacadeDevice } from '../../../../device/interfaces/acl/device-context-facade';
import { DashboardMetrics } from '../../../domain/services/analytics-query-service';
import { TrendPoint } from '../../../domain/model/valueobjects/trend-point.value-object';
import { LatestTelemetrySummary } from '../../../../evaluation/interfaces/acl/evaluation-context-facade';
import { createGetDashboardMetricsQuery } from '../../../domain/model/queries/get-dashboard-metrics.query';
import { createGetTrendsQuery } from '../../../domain/model/queries/get-trends.query';

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
    HeaderComponent
  ],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.css'
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
  selectedPeriod = 'LIVE'; // Options: 'LIVE', 'Day', 'Week', 'Month', 'CUSTOM'
  selectedMetric = 'aqiValue'; // Options: 'aqiValue', 'pm2_5', 'co2', 'temperature', 'humidity'

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

  // Load organizations
  private loadOrganizations(): void {
    this.loading = true;
    this.deviceAclService.fetchOrganizations().pipe(takeUntil(this.destroy$)).subscribe({
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
        console.error('Failed to load organizations', err);
        this.error = 'Failed to load organizations. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Handler for Organization change
  onOrgChange(): void {
    this.spaces = [];
    this.devices = [];
    this.selectedSpaceId = '';
    this.selectedDeviceId = '';
    this.liveData = null;
    this.trendDataPoints = [];
    this.lastReadings = null;
    this.stopPolling();

    if (!this.selectedOrgId) {
      this.cdr.markForCheck();
      return;
    }

    this.deviceAclService.fetchSpacesByOrganization(this.selectedOrgId)
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
          console.error('Failed to load spaces', err);
          this.error = 'Failed to load spaces.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  // Handler for Space change
  onSpaceChange(): void {
    this.devices = [];
    this.selectedDeviceId = '';
    this.liveData = null;
    this.trendDataPoints = [];
    this.lastReadings = null;
    this.stopPolling();

    if (!this.selectedSpaceId) {
      this.cdr.markForCheck();
      return;
    }

    this.deviceAclService.fetchDevicesBySpace(this.selectedSpaceId)
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
          console.error('Failed to load devices', err);
          this.error = 'Failed to load devices.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  // Handler for Device change
  onDeviceChange(): void {
    this.liveData = null;
    this.trendDataPoints = [];
    this.lastReadings = null;
    this.stopPolling();

    if (!this.selectedDeviceId) {
      this.cdr.markForCheck();
      return;
    }

    this.fetchData();
    this.startPolling();
  }

  // Fetch telemetry, metrics and trend data
  fetchData(): void {
    if (!this.selectedDeviceId) return;

    this.loading = true;
    this.error = null;

    // Format custom dates if active
    const startIso = this.selectedPeriod === 'CUSTOM' && this.startDate ? this.startDate.toISOString() : undefined;
    const endIso = this.selectedPeriod === 'CUSTOM' && this.endDate ? this.endDate.toISOString() : undefined;
    const apiPeriod = this.selectedPeriod === 'CUSTOM' ? undefined : this.selectedPeriod;

    // 1. Fetch dashboard metric summary (e.g. averages and deltas)
    const metricsQuery = createGetDashboardMetricsQuery(this.selectedDeviceId, apiPeriod, startIso, endIso);
    this.analyticsQueryService.handleGetDashboardMetrics(metricsQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (metrics) => {
          this.liveData = metrics;
          this.secondsSinceUpdate = 0;
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          // Handle 404 local empty state elegantly as per guidelines, instead of showing fullscreen error
          console.warn('Dashboard metrics returned empty or failed:', err);
          this.liveData = null;
          this.cdr.markForCheck();
        }
      });

    // 2. Fetch trend points for charts
    const apiTrendPeriod = this.selectedPeriod === 'LIVE' ? 'DAY' : (this.selectedPeriod === 'CUSTOM' ? undefined : this.selectedPeriod.toUpperCase());
    const trendsQuery = createGetTrendsQuery(this.selectedDeviceId, apiTrendPeriod, startIso, endIso);
    this.analyticsQueryService.handleGetTrends(trendsQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (trends) => {
          this.trendDataPoints = trends;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.warn('Trend points returned empty or failed:', err);
          this.trendDataPoints = [];
          this.loading = false;
          this.cdr.markForCheck();
        }
      });

    // 3. Fetch latest raw telemetry for "Last Readings" section via ACL
    this.telemetryAclService.fetchLatestTelemetryByDevice(this.selectedDeviceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (telemetry) => {
          this.lastReadings = telemetry;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to load last readings via ACL', err);
          this.lastReadings = null;
          this.cdr.markForCheck();
        }
      });
  }

  // Setup auto-refresh polling
  private startPolling(): void {
    this.stopPolling();
    // Poll every 30 seconds
    this.refreshSubscription = interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchData();
      });
  }

  private stopPolling(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = undefined;
    }
  }

  // Polish: live counter tracker showing "Updated X seconds ago"
  private startSecondsCounter(): void {
    this.secondsCounterSubscription = interval(1000).subscribe(() => {
      this.secondsSinceUpdate++;
      this.cdr.markForCheck();
    });
  }

  // Handler for period buttons
  selectPeriod(period: string): void {
    this.selectedPeriod = period;
    this.startDate = null;
    this.endDate = null;
    this.fetchData();
    this.startPolling();
  }

  // Handlers for date selection from datepicker
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

  // Handler for clicking KPI cards
  selectMetric(metric: string): void {
    this.selectedMetric = metric;
    this.cdr.markForCheck();
  }

  // Getters for displaying data safely with fallbacks
  get aqiValue(): number | string {
    return this.liveData?.aqi.value ?? '--';
  }

  get aqiCategory(): string {
    return this.liveData?.aqi.category ?? 'Sin mediciones';
  }

  get formattedUpdateTime(): string {
    if (this.secondsSinceUpdate < 5) return 'just now';
    return `${this.secondsSinceUpdate} seconds ago`;
  }

  // EPA AQI indicator color
  get aqiColor(): string {
    const val = this.liveData?.aqi.value;
    if (val === undefined || val === null) return '#3a3a3c'; // Gray fallback
    if (val <= 50) return '#10b981'; // Green
    if (val <= 100) return '#f59e0b'; // Yellow
    if (val <= 150) return '#f97316'; // Orange
    return '#ef4444'; // Red
  }

  // Progress SVG parameters
  get progressOffset(): number {
    const val = this.liveData?.aqi.value;
    if (val === undefined || val === null) return 251.2; // Full offset (empty circle)
    const maxAqi = 150; // Map max AQI range to 150 for visible arc scaling
    const percent = Math.min(Math.max(val / maxAqi, 0), 1);
    const circumference = 251.2;
    return circumference * (1 - percent);
  }

  // Dynamic indicator dot colors for KPI cards
  get pm25StatusColor(): string {
    const val = this.liveData?.pm2_5.value;
    if (val === undefined || val === null) return '#3a3a3c';
    if (val <= 25) return '#10b981';
    if (val <= 60) return '#f59e0b';
    return '#ef4444';
  }

  get co2StatusColor(): string {
    const val = this.liveData?.co2.value;
    if (val === undefined || val === null) return '#3a3a3c';
    if (val <= 700) return '#10b981';
    if (val <= 1000) return '#f59e0b';
    return '#ef4444';
  }

  get tempStatusColor(): string {
    const val = this.liveData?.temperature.value;
    if (val === undefined || val === null) return '#3a3a3c';
    if (val <= 26) return '#10b981';
    return '#ef4444';
  }

  get humidityStatusColor(): string {
    const val = this.liveData?.humidity.value;
    if (val === undefined || val === null) return '#3a3a3c';
    if (val <= 60) return '#10b981';
    if (val <= 85) return '#f59e0b';
    return '#ef4444';
  }

  // SVG Chart Computations
  get chartPoints(): string {
    if (this.trendDataPoints.length === 0) return '';

    const width = 500;
    const height = 150;
    const padding = 20;

    const values = this.trendDataPoints.map(p => this.getMetricValue(p, this.selectedMetric));
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const valRange = maxVal - minVal || 1;

    const points = this.trendDataPoints.map((p, index) => {
      const x = padding + (index / (this.trendDataPoints.length - 1)) * (width - 2 * padding);
      const val = this.getMetricValue(p, this.selectedMetric);
      const y = height - padding - ((val - minVal) / valRange) * (height - 2 * padding);
      return { x, y };
    });

    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y} L ${width - padding} ${points[0].y}`;
    }

    // Make smooth bezier curve
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const xc = (curr.x + next.x) / 2;
      const yc = (curr.y + next.y) / 2;
      d += ` Q ${curr.x} ${curr.y}, ${xc} ${yc}`;
    }
    const last = points[points.length - 1];
    d += ` L ${last.x} ${last.y}`;

    return d;
  }

  get chartFillPoints(): string {
    const linePath = this.chartPoints;
    if (!linePath || this.trendDataPoints.length === 0) return '';

    const width = 500;
    const height = 150;
    const padding = 20;
    const points = this.trendDataPoints.map((p, index) => {
      const x = padding + (index / (this.trendDataPoints.length - 1)) * (width - 2 * padding);
      return x;
    });

    const firstX = points[0];
    const lastX = points[points.length - 1] ?? width - padding;

    return `${linePath} L ${lastX} ${height - padding} L ${firstX} ${height - padding} Z`;
  }

  // Get dynamic metric value from TrendPoint
  getMetricValue(point: TrendPoint, metric: string): number {
    switch (metric) {
      case 'aqiValue': return point.aqiValue;
      case 'co2': return point.co2;
      case 'pm2_5': return point.pm2_5;
      case 'temperature': return point.temperature;
      case 'humidity': return point.humidity;
      default: return point.aqiValue;
    }
  }

  // Delta trend formatting supporting null values
  get activeMetricDelta(): number | null {
    if (!this.liveData) return null;
    switch (this.selectedMetric) {
      case 'aqiValue': return this.liveData.pm2_5.deltaPercentage; // Standard delta approximation for AQI
      case 'co2': return this.liveData.co2.deltaPercentage;
      case 'pm2_5': return this.liveData.pm2_5.deltaPercentage;
      case 'temperature': return this.liveData.temperature.deltaPercentage;
      case 'humidity': return this.liveData.humidity.deltaPercentage;
      default: return null;
    }
  }

  isDeltaPositive(delta: number | null | undefined): boolean {
    if (delta === null || delta === undefined) return false;
    return delta >= 0;
  }

  formatDelta(delta: number | null | undefined): string {
    if (delta === null || delta === undefined) return 'N/A';
    const absVal = Math.abs(delta).toFixed(1);
    return `${absVal}%`;
  }
}
