import { Component, OnInit, Inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { jwtDecode } from 'jwt-decode';
import { TOKEN_STORAGE_GATEWAY, TokenStorageGateway } from './iam/infrastructure/storage/token-storage.gateway';
import { BillingQueryServiceImpl } from './billing/application/internal/queryservices/billing-query-service.impl';
import { createGetUserPlanQuery } from './billing/domain/model/queries/get-user-plan.query';
import { createUserId } from './billing/domain/model/valueobjects/user-id.value-object';

type AccessTokenPayload = {
  sub: string; // userId
  type: 'access' | 'refresh';
  jti: string;
  iat: number;
  exp: number;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  constructor(
    @Inject(TOKEN_STORAGE_GATEWAY) private tokenStorage: TokenStorageGateway,
    private billingQueryService: BillingQueryServiceImpl,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
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
              if (domainPlan.plan === 'VISITOR' || domainPlan.plan === 'FREEMIUM') {
                const snackBarRef = this.snackBar.open('Upgrade plan', 'Upgrade', {
                  verticalPosition: 'top',
                  duration: 10000,
                  panelClass: ['subtle-snackbar']
                });

                snackBarRef.onAction().subscribe(() => {
                  this.router.navigate(['/billing/select-plan']);
                });
              }
            },
            error: (err) => console.error('Failed to get user plan', err)
          });
        }
      } catch (e) {
        console.error('Error decoding token', e);
      }
    }
  }
}
