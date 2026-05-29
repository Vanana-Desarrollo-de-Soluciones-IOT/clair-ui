import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OverviewContextFacade,
  OverviewMeasurements,
} from '../../interfaces/acl/overview-context-facade';
import { createGetLatestOverviewMeasurementsQuery } from '../../domain/model/queries/get-latest-overview-measurements.query';
import { OverviewQueryServiceImpl } from '../internal/acl/queryservices/overview-query-service.impl';

@Injectable({ providedIn: 'root' })
export class OverviewContextFacadeImpl implements OverviewContextFacade {
  constructor(private readonly overviewQueryService: OverviewQueryServiceImpl) {}

  getLatestOverviewMeasurements(): Observable<OverviewMeasurements | null> {
    return this.overviewQueryService.handleGetLatestOverviewMeasurements(
      createGetLatestOverviewMeasurementsQuery(),
    );
  }
}
