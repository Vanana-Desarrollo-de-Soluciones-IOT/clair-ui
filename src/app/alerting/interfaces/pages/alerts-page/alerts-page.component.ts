import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/interfaces/components/header/header.component';
import { ExternalAlertingDeviceService } from '../../../application/internal/outboundservices/acl/external-alerting-device.service';
import { AlertQueryServiceImpl } from '../../../application/internal/queryservices/alert-query-service.impl';
import { Alert, AlertPage } from '../../../domain/services/alert-query-service';
import { AlertStatus } from '../../../domain/model/valueobjects/alert-status.value-object';
import { MetricType } from '../../../domain/model/valueobjects/metric-type.value-object';
import { createGetAlertsBySpaceQuery } from '../../../domain/model/queries/get-alerts-by-space.query';
import { createGetAlertsByDeviceQuery } from '../../../domain/model/queries/get-alerts-by-device.query';
import { FacadeOrganization, FacadeSpace, FacadeDevice } from '../../../../device/interfaces/acl/device-context-facade';
import { AlertListComponent, AlertViewMode } from '../../components/alert-list/alert-list.component';
import { AlertFiltersComponent } from '../../components/alert-filters/alert-filters.component';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    SidebarComponent,
    HeaderComponent,
    AlertListComponent,
    AlertFiltersComponent,
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

  // Alerts state
  alertsPage: AlertPage | null = null;
  filteredAlerts: readonly Alert[] | null = null;
  loading = false;
  error = '';

  // Filters
  selectedStatus: AlertStatus | 'ALL' = 'ALL';
  selectedMetric: MetricType | 'ALL' = 'ALL';

  // Pagination
  currentPage = 0;
  pageSize = 20;

  // View mode
  viewMode: AlertViewMode = 'grid';

  ngOnInit(): void {
    this.loadOrganizations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  private loadOrganizations(): void {
    this.loading = true;
    this.deviceAclService.fetchOrganizations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orgs: FacadeOrganization[]) => {
          this.organizations = orgs;
          if (orgs.length > 0) {
            this.selectedOrgId = orgs[0].id;
            this.onOrgChange();
          } else {
            this.loading = false;
            this.cdr.markForCheck();
          }
        },
        error: (err: any) => {
          console.error('Failed to load organizations', err);
          this.error = 'Failed to load organizations';
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onOrgChange(): void {
    this.spaces = [];
    this.devices = [];
    this.selectedSpaceId = '';
    this.selectedDeviceId = '';
    this.clearAlerts();

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
          this.error = 'Failed to load spaces';
          this.cdr.markForCheck();
        },
      });
  }

  onSpaceChange(): void {
    this.devices = [];
    this.selectedDeviceId = '';
    this.clearAlerts();

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
          this.loadAlerts();
        },
        error: (err: any) => {
          console.error('Failed to load devices', err);
          this.error = 'Failed to load devices';
          this.cdr.markForCheck();
        },
      });
  }

  onDeviceChange(): void {
    this.currentPage = 0;
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.loading = true;
    this.error = '';
    this.cdr.markForCheck();

    if (this.selectedDeviceId) {
      const query = createGetAlertsByDeviceQuery(this.selectedDeviceId, this.currentPage, this.pageSize);
      this.alertQueryService.handleGetAlertsByDevice(query)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (page: AlertPage) => {
            this.alertsPage = page;
            this.applyFilters();
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: (err: any) => {
            console.error('Failed to load alerts', err);
            this.error = 'Failed to load alerts. Please try again.';
            this.loading = false;
            this.cdr.markForCheck();
          },
        });
      return;
    }

    const query = createGetAlertsBySpaceQuery(this.selectedSpaceId, this.currentPage, this.pageSize);

    this.alertQueryService.handleGetAlertsBySpace(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (page: AlertPage) => {
        this.alertsPage = page;
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Failed to load alerts', err);
        this.error = 'Failed to load alerts. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onStatusFilterChanged(status: AlertStatus | 'ALL'): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onMetricFilterChanged(metric: MetricType | 'ALL'): void {
    this.selectedMetric = metric;
    this.applyFilters();
  }

  private applyFilters(): void {
    if (!this.alertsPage) {
      this.filteredAlerts = null;
      return;
    }

    let filtered = [...this.alertsPage.content];

    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter((a) => a.status === this.selectedStatus);
    }

    if (this.selectedMetric !== 'ALL') {
      filtered = filtered.filter((a) => a.metric === this.selectedMetric);
    }

    this.filteredAlerts = Object.freeze(filtered);
  }

  private clearAlerts(): void {
    this.alertsPage = null;
    this.filteredAlerts = null;
    this.error = '';
    this.currentPage = 0;
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAlerts();
    }
  }

  nextPage(): void {
    if (this.alertsPage && this.currentPage < this.alertsPage.totalPages - 1) {
      this.currentPage++;
      this.loadAlerts();
    }
  }

  get totalAlerts(): number {
    return this.alertsPage?.totalElements ?? 0;
  }

  get activeCount(): number {
    return this.alertsPage?.content.filter((a: Alert) => a.status === 'ACTIVE').length ?? 0;
  }

  get acknowledgedCount(): number {
    return this.alertsPage?.content.filter((a: Alert) => a.status === 'ACKNOWLEDGED').length ?? 0;
  }

  get resolvedCount(): number {
    return this.alertsPage?.content.filter((a: Alert) => a.status === 'RESOLVED').length ?? 0;
  }

  get showPagination(): boolean {
    return !!this.alertsPage && this.alertsPage.totalPages > 1;
  }

  setViewMode(mode: AlertViewMode): void {
    this.viewMode = mode;
  }
}
