import { Observable } from 'rxjs';
import { GetLatestOverviewMeasurementsQuery } from '../model/queries/get-latest-overview-measurements.query';
import { OverviewMeasurements } from '../../interfaces/acl/overview-context-facade';

export interface OverviewQueryService {
  handleGetLatestOverviewMeasurements(
    query: GetLatestOverviewMeasurementsQuery,
  ): Observable<OverviewMeasurements | null>;
}
