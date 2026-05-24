import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/interfaces/components/header/header.component';
import { ExternalDeviceService } from '../../../application/internal/outboundservices/acl/external-device.service';
import { ExternalTelemetryService } from '../../../application/internal/outboundservices/acl/external-telemetry.service';
import { AirQualityQueryServiceImpl } from '../../../application/internal/queryservices/air-quality-query-service.impl';
import { FacadeOrganization, FacadeSpace, FacadeDevice } from '../../../../device/interfaces/acl/device-context-facade';
import { AirQualityLive } from '../../../domain/services/air-quality-query-service';
import { TrendPoint } from '../../../domain/model/valueobjects/trend-point.value-object';
import { createGetAirQualityLiveQuery } from '../../../domain/model/queries/get-air-quality-live.query';
import { createGetAirQualityTrendsQuery } from '../../../domain/model/queries/get-air-quality-trends.query';

@Component({
  selector: 'app-air-quality-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './air-quality-page.component.html',
  styleUrl: './air-quality-page.component.css'
})
export class AirQualityPageComponent implements OnInit, OnDestroy {
  private readonly deviceAclService = inject(ExternalDeviceService);
  private readonly deviceTelemetryAclService = inject(ExternalTelemetryService);
  private readonly airQualityQueryService = inject(AirQualityQueryServiceImpl);
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

  // Telemetry data
  liveData: AirQualityLive | null = null;
  trendDataPoints: TrendPoint[] = [];

  // Controls
  selectedPeriod = 'LIVE'; // Options: 'LIVE', 'Day', 'Week', 'Month'
  selectedMetric = 'aqiValue'; // Options: 'aqiValue', 'pm2_5', 'co2', 'temperature', 'humidity'

  // Refresher tracking
  secondsSinceUpdate = 0;
  private refreshSubscription?: Subscription;
  private secondsCounterSubscription?: Subscription;

  // Thresholds static limits as requested
  readonly thresholds = {
    pm2_5: 60,
    co2: 1000,
    temperature: 26,
    humidity: 85
  };

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
    this.stopPolling();

    if (!this.selectedDeviceId) {
      this.cdr.markForCheck();
      return;
    }

    this.fetchData();
    this.startPolling();
  }

  // Fetch telemetry and trend data
  fetchData(): void {
    if (!this.selectedDeviceId) return;

    this.loading = true;
    this.error = null;

    if (this.selectedPeriod === 'LIVE') {
      // 1. Fetch latest telemetry from ACL
      this.deviceTelemetryAclService.fetchLatestTelemetryByDevice(this.selectedDeviceId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (summary) => {
            if (summary) {
              const aqiVal = this.calculateAqiFromPm25(summary.pm2_5 ?? 0);
              this.liveData = {
                aqi: {
                  value: aqiVal,
                  category: this.getAqiCategory(aqiVal)
                },
                co2: {
                  value: summary.co2 ?? 0,
                  deltaPercentage: this.calculateDeltaForMetric('co2')
                },
                pm2_5: {
                  value: summary.pm2_5 ?? 0,
                  deltaPercentage: this.calculateDeltaForMetric('pm2_5')
                },
                temperature: {
                  value: summary.temperature ?? 0,
                  deltaPercentage: this.calculateDeltaForMetric('temperature')
                },
                humidity: {
                  value: summary.humidity ?? 0,
                  deltaPercentage: this.calculateDeltaForMetric('humidity')
                },
                calculatedAt: summary.recordedAt
              };
              this.secondsSinceUpdate = 0;
            }
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Failed to fetch latest telemetry via ACL', err);
            this.error = 'Failed to fetch latest telemetry.';
            this.cdr.markForCheck();
          }
        });

      // 2. Fetch trends for Day to draw the graph
      const trendQuery = createGetAirQualityTrendsQuery(this.selectedDeviceId, 'DAY');
      this.airQualityQueryService.handleGetAirQualityTrends(trendQuery)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (trends) => {
            this.trendDataPoints = trends;
            this.loading = false;
            // Update liveData deltas if liveData was already populated
            if (this.liveData) {
              this.liveData = {
                ...this.liveData,
                co2: { ...this.liveData.co2, deltaPercentage: this.calculateDeltaForMetric('co2') },
                pm2_5: { ...this.liveData.pm2_5, deltaPercentage: this.calculateDeltaForMetric('pm2_5') },
                temperature: { ...this.liveData.temperature, deltaPercentage: this.calculateDeltaForMetric('temperature') },
                humidity: { ...this.liveData.humidity, deltaPercentage: this.calculateDeltaForMetric('humidity') }
              };
            }
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Failed to fetch trends for LIVE mode', err);
            this.trendDataPoints = [];
            this.loading = false;
            this.cdr.markForCheck();
          }
        });

    } else {
      // Historical mode (Day, Week, Month)
      const apiPeriod = this.selectedPeriod.toUpperCase();
      const trendQuery = createGetAirQualityTrendsQuery(this.selectedDeviceId, apiPeriod);

      this.airQualityQueryService.handleGetAirQualityTrends(trendQuery)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (trends) => {
            this.trendDataPoints = trends;
            this.loading = false;

            if (trends && trends.length > 0) {
              const lastPoint = trends[trends.length - 1];
              this.liveData = {
                aqi: {
                  value: lastPoint.aqiValue,
                  category: this.getAqiCategory(lastPoint.aqiValue)
                },
                co2: {
                  value: lastPoint.co2,
                  deltaPercentage: this.calculateDeltaForMetric('co2')
                },
                pm2_5: {
                  value: lastPoint.pm2_5,
                  deltaPercentage: this.calculateDeltaForMetric('pm2_5')
                },
                temperature: {
                  value: lastPoint.temperature,
                  deltaPercentage: this.calculateDeltaForMetric('temperature')
                },
                humidity: {
                  value: lastPoint.humidity,
                  deltaPercentage: this.calculateDeltaForMetric('humidity')
                },
                calculatedAt: lastPoint.timestamp
              };
              this.secondsSinceUpdate = 0;
            } else {
              this.liveData = null;
            }
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Failed to fetch trend data', err);
            this.trendDataPoints = [];
            this.liveData = null;
            this.loading = false;
            this.error = 'Failed to fetch trend data.';
            this.cdr.markForCheck();
          }
        });
    }
  }

  getAqiCategory(val: number): string {
    if (val <= 50) return 'GOOD';
    if (val <= 100) return 'MODERATE';
    if (val <= 150) return 'UNHEALTHY';
    return 'HAZARDOUS';
  }

  calculateDeltaForMetric(metric: string): number {
    if (this.trendDataPoints.length < 2) return 0;
    const firstPoint = this.trendDataPoints[0];
    const lastPoint = this.trendDataPoints[this.trendDataPoints.length - 1];
    const first = this.getMetricValue(firstPoint, metric);
    const last = this.getMetricValue(lastPoint, metric);
    if (first === 0) return 0;
    return ((last - first) / first) * 100;
  }

  calculateAqiFromPm25(pm25: number): number {
    if (pm25 <= 12) {
      return Math.round((50 - 0) / (12 - 0) * (pm25 - 0) + 0);
    } else if (pm25 <= 35.4) {
      return Math.round((100 - 51) / (35.4 - 12) * (pm25 - 12) + 51);
    } else if (pm25 <= 55.4) {
      return Math.round((150 - 101) / (55.4 - 35.4) * (pm25 - 35.4) + 101);
    } else if (pm25 <= 150.4) {
      return Math.round((200 - 151) / (150.4 - 55.4) * (pm25 - 55.4) + 151);
    } else {
      return Math.round((300 - 201) / (250.4 - 150.5) * (pm25 - 150.5) + 201);
    }
  }

  // Setup auto-refresh polling
  private startPolling(): void {
    this.stopPolling();
    // Poll every 30 seconds as approved by user
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
    this.fetchData();
    this.startPolling();
  }

  // Handler for clicking KPI cards
  selectMetric(metric: string): void {
    this.selectedMetric = metric;
    this.cdr.markForCheck();
  }

  // Helper properties to retrieve values for current active device
  get aqiValue(): number {
    return this.liveData?.aqi.value ?? 0;
  }

  get aqiCategory(): string {
    return this.liveData?.aqi.category ?? '--';
  }

  get formattedUpdateTime(): string {
    if (this.secondsSinceUpdate < 5) return 'just now';
    return `${this.secondsSinceUpdate} seconds ago`;
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
    const lastX = points[points.length - 1];

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

  // Utility to determine if delta is positive or negative
  isDeltaPositive(delta: number): boolean {
    return delta >= 0;
  }

  formatDelta(delta: number): string {
    const absVal = Math.abs(delta).toFixed(1);
    return `${absVal}%`;
  }

  // Progress SVG parameters
  get progressOffset(): number {
    const val = this.aqiValue;
    const maxAqi = 150; // Map max AQI range to 150 for visible arc scaling
    const percent = Math.min(Math.max(val / maxAqi, 0), 1);
    const circumference = 251.2;
    return circumference * (1 - percent);
  }

  get activeMetricDelta(): number {
    if (!this.liveData) return 0;
    switch (this.selectedMetric) {
      case 'aqiValue': return 1.2; // Fixed baseline trend delta matching mockup
      case 'co2': return this.liveData.co2.deltaPercentage;
      case 'pm2_5': return this.liveData.pm2_5.deltaPercentage;
      case 'temperature': return this.liveData.temperature.deltaPercentage;
      case 'humidity': return this.liveData.humidity.deltaPercentage;
      default: return 0;
    }
  }

  get aqiColor(): string {
    const val = this.aqiValue;
    if (val <= 50) return '#10b981'; // Green
    if (val <= 100) return '#f59e0b'; // Yellow
    if (val <= 150) return '#f97316'; // Orange
    return '#ef4444'; // Red
  }

  // Dynamic indicator dot colors for cards
  get pm25StatusColor(): string {
    const val = this.liveData?.pm2_5.value ?? 0;
    if (val <= 25) return '#10b981';
    if (val <= 60) return '#f59e0b';
    return '#ef4444';
  }

  get co2StatusColor(): string {
    const val = this.liveData?.co2.value ?? 0;
    if (val <= 700) return '#10b981';
    if (val <= 1000) return '#f59e0b';
    return '#ef4444';
  }

  get tempStatusColor(): string {
    const val = this.liveData?.temperature.value ?? 0;
    if (val <= 26) return '#10b981';
    return '#ef4444';
  }

  get humidityStatusColor(): string {
    const val = this.liveData?.humidity.value ?? 0;
    if (val <= 60) return '#10b981';
    if (val <= 85) return '#f59e0b';
    return '#ef4444';
  }
}
