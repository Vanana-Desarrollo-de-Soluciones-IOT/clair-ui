import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/interfaces/components/header/header.component';
import { ExternalAlertingDeviceService } from '../../../application/internal/outboundservices/acl/external-alerting-device.service';
import { AlertQueryServiceImpl } from '../../../application/internal/queryservices/alert-query-service.impl';
import { Alert, AlertPage, DailyAlertCount } from '../../../domain/services/alert-query-service';
import { AlertStatus, AlertStatus_ACTIVE, AlertStatus_ACKNOWLEDGED, AlertStatus_RESOLVED } from '../../../domain/model/valueobjects/alert-status.value-object';
import { createGetAlertsBySpaceQuery } from '../../../domain/model/queries/get-alerts-by-space.query';
import { createGetAlertsByDeviceQuery } from '../../../domain/model/queries/get-alerts-by-device.query';
import { FacadeOrganization, FacadeSpace, FacadeDevice } from '../../../../device/interfaces/acl/device-context-facade';
import { AlertDailyChartComponent } from '../../components/alert-daily-chart/alert-daily-chart.component';
import { AlertTableComponent } from '../../components/alert-table/alert-table.component';

type AlertTab = 'active' | 'history';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    SidebarComponent,
    HeaderComponent,
    AlertDailyChartComponent,
    AlertTableComponent,
  ],
  templateUrl: './alerts-page.component.html',
  styleUrl: './alerts-page.component.css',
})
export class AlertsPageComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly deviceAclService: ExternalAlertingDeviceService,
    private readonly alertQueryService: AlertQueryServiceImpl,
    private readonly cdr: ChangeDetectorRef
  ) {}

  isSidebarOpen = true;

  // Dropdown data
  organizations: FacadeOrganization[] = [];
  spaces: FacadeSpace[] = [];
  devices: FacadeDevice[] = [];

  // Selections
  selectedOrgId = '';
  selectedSpaceId = '';
  selectedDeviceId = '';

  // Daily chart
  dailySummary: DailyAlertCount[] | null = null;
  loadingSummary = false;

  // Tabs & alerts
  activeTab: AlertTab = 'active';
  activeAlertsPage: AlertPage | null = null;
  historyAlertsPage: AlertPage | null = null;
  loadingAlerts = false;
  errorAlerts = '';

  // Pagination
  currentPage = 0;
  pageSize = 20;

  // Seconds counter for "Updated X seconds ago"
  secondsSinceUpdate = 0;
  private secondsCounterSubscription?: any;

  ngOnInit(): void {
    this.loadOrganizations();
    this.startSecondsCounter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.secondsCounterSubscription) {
      clearInterval(this.secondsCounterSubscription);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  setTab(tab: AlertTab): void {
    this.activeTab = tab;
    this.currentPage = 0;
    this.loadAlertsForTab();
  }

  private loadOrganizations(): void {
    this.deviceAclService.fetchOrganizations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orgs: FacadeOrganization[]) => {
          this.organizations = orgs;
          if (orgs.length > 0) {
            this.selectedOrgId = orgs[0].id;
            this.onOrgChange();
          } else {
            this.cdr.markForCheck();
          }
        },
        error: (err: any) => {
          console.error('Failed to load organizations', err);
          this.cdr.markForCheck();
        },
      });
  }

  onOrgChange(): void {
    this.spaces = [];
    this.devices = [];
    this.selectedSpaceId = '';
    this.selectedDeviceId = '';
    this.clearData();

    if (!this.selectedOrgId) {
      this.cdr.markForCheck();
      return;
    }

    this.deviceAclService.fetchSpacesByOrganization(this.selectedOrgId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (spaces: FacadeSpace[]) => {
          this.spaces = spaces;
          if (spaces.length > 0) {
            this.selectedSpaceId = spaces[0].id;
            this.onSpaceChange();
          } else {
            this.cdr.markForCheck();
          }
        },
        error: (err: any) => {
          console.error('Failed to load spaces', err);
          this.cdr.markForCheck();
        },
      });
  }

  onSpaceChange(): void {
    this.devices = [];
    this.selectedDeviceId = '';
    this.clearData();

    if (!this.selectedSpaceId) {
      this.cdr.markForCheck();
      return;
    }

    this.deviceAclService.fetchDevicesBySpace(this.selectedSpaceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (devices: FacadeDevice[]) => {
          this.devices = devices;
          this.cdr.markForCheck();
          this.loadDailySummary();
          this.loadAlertsForTab();
        },
        error: (err: any) => {
          console.error('Failed to load devices', err);
          this.cdr.markForCheck();
        },
      });
  }

  onDeviceChange(): void {
    this.currentPage = 0;
    this.loadDailySummary();
    this.loadAlertsForTab();
  }

  private loadDailySummary(): void {
    if (!this.selectedSpaceId) return;
    this.loadingSummary = true;
    this.cdr.markForCheck();

    this.alertQueryService.handleGetDailySummaryBySpace(this.selectedSpaceId, 30)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (summary: DailyAlertCount[]) => {
          this.dailySummary = summary;
          this.loadingSummary = false;
          this.secondsSinceUpdate = 0;
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          console.error('Failed to load daily summary', err);
          this.loadingSummary = false;
          this.cdr.markForCheck();
        },
      });
  }

  private loadAlertsForTab(): void {
    if (!this.selectedSpaceId && !this.selectedDeviceId) return;
    this.loadingAlerts = true;
    this.errorAlerts = '';
    this.cdr.markForCheck();

    const statusFilter = this.activeTab === 'active'
      ? [AlertStatus_ACTIVE, AlertStatus_ACKNOWLEDGED]
      : [AlertStatus_RESOLVED];

    if (this.selectedDeviceId) {
      const query = createGetAlertsByDeviceQuery(this.selectedDeviceId, this.currentPage, this.pageSize);
      this.alertQueryService.handleGetAlertsByDevice(query, statusFilter)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (page: AlertPage) => {
            this.setAlertsPage(page);
            this.loadingAlerts = false;
            this.cdr.markForCheck();
          },
          error: (err: any) => {
            console.error('Failed to load alerts', err);
            this.errorAlerts = 'Failed to load alerts';
            this.loadingAlerts = false;
            this.cdr.markForCheck();
          },
        });
      return;
    }

    const query = createGetAlertsBySpaceQuery(this.selectedSpaceId, this.currentPage, this.pageSize);
    this.alertQueryService.handleGetAlertsBySpace(query, statusFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page: AlertPage) => {
          this.setAlertsPage(page);
          this.loadingAlerts = false;
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          console.error('Failed to load alerts', err);
          this.errorAlerts = 'Failed to load alerts';
          this.loadingAlerts = false;
          this.cdr.markForCheck();
        },
      });
  }

  private setAlertsPage(page: AlertPage): void {
    if (this.activeTab === 'active') {
      this.activeAlertsPage = page;
    } else {
      this.historyAlertsPage = page;
    }
  }

  get currentAlerts(): readonly Alert[] | null {
    return this.activeTab === 'active'
      ? this.activeAlertsPage?.content ?? null
      : this.historyAlertsPage?.content ?? null;
  }

  get showPagination(): boolean {
    const page = this.activeTab === 'active' ? this.activeAlertsPage : this.historyAlertsPage;
    return !!page && page.totalPages > 1;
  }

  get totalPages(): number {
    const page = this.activeTab === 'active' ? this.activeAlertsPage : this.historyAlertsPage;
    return page?.totalPages ?? 1;
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAlertsForTab();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAlertsForTab();
    }
  }

  get formattedUpdateTime(): string {
    if (this.secondsSinceUpdate < 5) return 'just now';
    return `${this.secondsSinceUpdate} seconds ago`;
  }

  private startSecondsCounter(): void {
    this.secondsCounterSubscription = setInterval(() => {
      this.secondsSinceUpdate++;
      this.cdr.markForCheck();
    }, 1000);
  }

  private clearData(): void {
    this.dailySummary = null;
    this.activeAlertsPage = null;
    this.historyAlertsPage = null;
    this.errorAlerts = '';
    this.currentPage = 0;
  }
}
