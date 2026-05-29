import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/interfaces/components/header/header.component';
import { AqiCardComponent } from '../../components/aqi-card/aqi-card.component';
import { OrganizationCardComponent } from '../../components/organization-card/organization-card.component';
import { PollutantCardComponent } from '../../components/pollutant-card/pollutant-card.component';
import { AlertsCardComponent } from '../../components/alerts-card/alerts-card.component';
import {
  OVERVIEW_CONTEXT_FACADE,
  OverviewContextFacade,
  OverviewMeasurements,
} from '../../acl/overview-context-facade';

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
    @Inject(OVERVIEW_CONTEXT_FACADE)
    private readonly overviewContextFacade: OverviewContextFacade,
  ) {
    this.viewState$ = this.overviewContextFacade.getLatestOverviewMeasurements().pipe(
      map((measurements) => {
        if (!measurements) {
          return { status: 'empty' as const, measurements: null };
        }
        return { status: 'success' as const, measurements };
      }),
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
}
