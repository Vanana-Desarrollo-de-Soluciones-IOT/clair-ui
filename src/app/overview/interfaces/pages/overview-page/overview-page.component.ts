import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../../shared/interfaces/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/interfaces/components/header/header.component';
import { AqiCardComponent } from '../../components/aqi-card/aqi-card.component';
import { OrganizationCardComponent } from '../../components/organization-card/organization-card.component';
import { PollutantCardComponent } from '../../components/pollutant-card/pollutant-card.component';
import { AlertsCardComponent } from '../../components/alerts-card/alerts-card.component';
import {
  OVERVIEW_CONTEXT_FACADE,
  OverviewContextFacade,
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
  readonly measurements$;

  constructor(
    @Inject(OVERVIEW_CONTEXT_FACADE)
    private readonly overviewContextFacade: OverviewContextFacade,
  ) {
    this.measurements$ = this.overviewContextFacade.getLatestOverviewMeasurements();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
