import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BillingQueryService, UserPlanDomain } from '../../../domain/services/billing-query-service';
import { GetUserPlanQuery } from '../../../domain/model/queries/get-user-plan.query';
import { GetStripePublicKeyQuery } from '../../../domain/model/queries/get-stripe-public-key.query';
import { StripePublicKey } from '../../../domain/model/valueobjects/stripe-public-key.value-object';
import { userPlanResourceToDomain } from '../../../interfaces/rest/transform/user-plan.transform';
import { stripePublicKeyResourceToDomain } from '../../../interfaces/rest/transform/stripe-public-key.transform';
import { BillingHttpGateway } from '../../../infrastructure/api/gateways/billing-http.gateway';

@Injectable({ providedIn: 'root' })
export class BillingQueryServiceImpl implements BillingQueryService {
  constructor(private readonly billingGateway: BillingHttpGateway) {}

  handleGetUserPlan(query: GetUserPlanQuery): Observable<UserPlanDomain> {
    return this.billingGateway.getUserPlan(query.userId.value).pipe(
      map((resource) => userPlanResourceToDomain(resource))
    );
  }

  handleGetStripePublicKey(_query: GetStripePublicKeyQuery): Observable<StripePublicKey> {
    return this.billingGateway.getStripePublicKey().pipe(
      map((resource) => stripePublicKeyResourceToDomain(resource))
    );
  }
}
