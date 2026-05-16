import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BillingQueryService, UserPlanDomain } from '../../../domain/services/billing-query-service';
import { GetUserPlanQuery } from '../../../domain/model/queries/get-user-plan.query';
import { userPlanResourceToDomain } from '../../../interfaces/rest/transform/user-plan.transform';
import { BillingHttpGateway } from '../../../infrastructure/api/gateways/billing-http.gateway';

@Injectable({ providedIn: 'root' })
export class BillingQueryServiceImpl implements BillingQueryService {
  constructor(private readonly billingGateway: BillingHttpGateway) {}

  handleGetUserPlan(query: GetUserPlanQuery): Observable<UserPlanDomain> {
    return this.billingGateway.getUserPlan(query.userId.value).pipe(
      map((resource) => userPlanResourceToDomain(resource))
    );
  }
}
