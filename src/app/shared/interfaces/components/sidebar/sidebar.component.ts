import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AirQualityComponent } from '../icons/air-quality/air-quality.component';
import { AlertsActionsComponent } from '../icons/alerts-actions/alerts-actions.component';
import { OverviewComponent } from '../icons/overview/overview.component';
import { ReportsComponent } from '../icons/reports/reports.component';
import { SpaceDevicesComponent } from '../icons/space-devices/space-devices.component';
import { jwtDecode } from 'jwt-decode';
import { TOKEN_STORAGE_GATEWAY, TokenStorageGateway } from '../../../../iam/infrastructure/storage/token-storage.gateway';
import { BillingQueryServiceImpl } from '../../../../billing/application/internal/queryservices/billing-query-service.impl';
import { createUserId } from '../../../../billing/domain/model/valueobjects/user-id.value-object';
import { createGetUserPlanQuery } from '../../../../billing/domain/model/queries/get-user-plan.query';

interface NavItem {
  label: string;
  component: string;
  route?: string;
}

type AccessTokenPayload = {
  sub: string; // userId
  type: 'access' | 'refresh';
  jti: string;
  iat: number;
  exp: number;
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, AirQualityComponent, AlertsActionsComponent, OverviewComponent, ReportsComponent, SpaceDevicesComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = true;
  @Output() closeRequested = new EventEmitter<void>();

  isUpgradeVisible = false;

  constructor(
    @Inject(TOKEN_STORAGE_GATEWAY) private tokenStorage: TokenStorageGateway,
    private billingQueryService: BillingQueryServiceImpl,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkUserPlan();
  }

  private checkUserPlan(): void {
    const token = this.tokenStorage.getAccessToken();
    if (token) {
      try {
        const payload = jwtDecode<AccessTokenPayload>(token);
        const userIdStr = payload.sub;
        if (userIdStr) {
          const userId = createUserId(userIdStr);
          const query = createGetUserPlanQuery(userId);

          this.billingQueryService.handleGetUserPlan(query).subscribe({
            next: (domainPlan) => {
              this.isUpgradeVisible = domainPlan.plan === 'FREEMIUM';
              this.cdr.markForCheck();
            },
            error: (err) => console.error('Failed to get user plan', err)
          });
        }
      } catch (e) {
        console.error('Error decoding token', e);
      }
    }
  }

  onNavItemClick(): void {
    if (window.innerWidth <= 768) {
      this.closeRequested.emit();
    }
  }

  readonly navItems: NavItem[] = [
    { label: 'Overview', component: 'overview', route: '/overview' },
    { label: 'Air Quality', component: 'air-quality' },
    { label: 'Alerts & Actions', component: 'alerts-actions' },
    { label: 'Reports', component: 'reports' },
    { label: 'Space & Devices', component: 'space-devices', route: '/space-devices' },
  ];
}
