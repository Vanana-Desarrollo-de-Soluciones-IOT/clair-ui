import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/interfaces/components/header/header.component';
import { AqiCardComponent } from '../../components/overview/aqi-card/aqi-card.component';
import { OrganizationCardComponent } from '../../components/overview/organization-card/organization-card.component';
import { PollutantCardComponent } from '../../components/overview/pollutant-card/pollutant-card.component';
import { AlertsCardComponent } from '../../components/overview/alerts-card/alerts-card.component';
import {
  ANALYTICS_CONTEXT_FACADE,
  AnalyticsContextFacade,
} from '../../acl/analytics-context-facade';
import { AnalyticsOverviewSnapshot } from '../../../domain/model/valueobjects/analytics-overview.value-object';
import { AlertsCardItem } from '../../components/overview/alerts-card/alerts-card.component';
import { OrganizationAqiItem } from '../../components/overview/organization-card/organization-card.component';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    AqiCardComponent,
    OrganizationCardComponent,
    PollutantCardComponent,
    AlertsCardComponent,
  ],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.css',
})
export class OverviewPageComponent {
  isSidebarOpen = true;
  readonly viewState$: Observable<{
    status: 'loading' | 'success' | 'empty' | 'error';
    measurements: OverviewMeasurements | null;
  }>;

  constructor(
    @Inject(ANALYTICS_CONTEXT_FACADE)
    private readonly analyticsContextFacade: AnalyticsContextFacade,
  ) {
    this.viewState$ = this.analyticsContextFacade.getOverviewDashboard().pipe(
      map((snapshot) => this.toOverviewMeasurements(snapshot)),
      map((measurements) =>
        measurements ? ({ status: 'success' as const, measurements }) : ({ status: 'empty' as const, measurements: null }),
      ),
      startWith({ status: 'loading' as const, measurements: null }),
      catchError(() => of({ status: 'error' as const, measurements: null })),
    );
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  private toOverviewMeasurements(snapshot: AnalyticsOverviewSnapshot | null): OverviewMeasurements | null {
    if (!snapshot) return null;

    const organizations: OrganizationAqiItem[] = (snapshot.organizations ?? [])
      .flatMap((org) =>
        (org.spaces ?? []).map((space) => ({
          organizationName: org.organizationName,
          spaceName: space.spaceName,
          aqiValue: space.aqiValue ?? null,
          aqiCategory: space.aqiCategory ?? null,
        })),
      );

    const alerts: AlertsCardItem[] = (snapshot.alerts ?? []).map((a) => ({
      id: a.alertId,
      message: a.message,
      severity: a.severity,
      status: a.status,
      deviceName: a.deviceName ?? null,
      spaceName: a.spaceName ?? null,
      occurredAt: a.occurredAt,
    }));

    return {
      aqi:
        snapshot.core.aqiValue === null || snapshot.core.aqiCategory === null
          ? null
          : { value: snapshot.core.aqiValue, category: snapshot.core.aqiCategory },
      co2: snapshot.core.averageCo2 ?? null,
      temperature: snapshot.core.averageTemperature ?? null,
      humidity: snapshot.core.averageHumidity ?? null,
      pm2_5: snapshot.core.averagePm2_5 ?? null,
      recordedAt: snapshot.core.recordedAt ?? snapshot.updatedAt ?? null,
      organizations,
      alerts,
    };
  }
}

type OverviewMeasurements = Readonly<{
  aqi: {
    value: number;
    category: string;
  } | null;
  co2: number | null;
  temperature: number | null;
  humidity: number | null;
  pm2_5: number | null;
  recordedAt: string | null;
  organizations: OrganizationAqiItem[];
  alerts: AlertsCardItem[];
}>;
