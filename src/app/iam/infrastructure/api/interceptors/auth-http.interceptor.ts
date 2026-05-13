import { Injectable, inject, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TokenStorageGateway, TOKEN_STORAGE_GATEWAY } from '../../storage/token-storage.gateway';
import { RefreshTokenResponseResource } from '../../../interfaces/rest/resources/refresh-token-response.resource';
import { API_CONFIG } from '../../../../api.config';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  private readonly tokenStorage = inject<TokenStorageGateway>(TOKEN_STORAGE_GATEWAY);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private isRefreshing = false;
  private readonly refreshSubject = new BehaviorSubject<string | null>(null);

  private readonly baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.iam;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isPublicUrl(req.url)) {
      return next.handle(req);
    }

    const token = this.tokenStorage.getAccessToken();
    if (token) {
      req = this.addTokenHeader(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && token) {
          return this.handle401(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private isPublicUrl(url: string): boolean {
    const publicPaths = ['/sign-up', '/sign-in', '/confirm', '/refresh'];
    return publicPaths.some(path => url.includes(path));
  }

  private addTokenHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handle401(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isRefreshing) {
      return this.refreshSubject.pipe(
        filter(t => t !== null),
        take(1),
        switchMap(t => next.handle(this.addTokenHeader(req, t!)))
      );
    }

    this.isRefreshing = true;
    this.refreshSubject.next(null);

    const refreshToken = this.tokenStorage.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    const http = this.injector.get(HttpClient);
    return http
      .post<RefreshTokenResponseResource>(`${this.baseUrl}/refresh`, { refreshToken })
      .pipe(
        switchMap(response => {
          this.isRefreshing = false;
          this.tokenStorage.setTokens(response.token, response.refreshToken);
          this.refreshSubject.next(response.token);
          return next.handle(this.addTokenHeader(req, response.token));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.logout();
          return throwError(() => err);
        })
      );
  }

  private logout(): void {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }
}
