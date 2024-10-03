import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private excludedUrls: string[] = ['/auth/atualizar-senha'];

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isExcluded(req.url)) {
      return next.handle(req);
    }
    const token = this.authService.getToken();
    let cloned = req;

    if (token) {
      cloned = this.addTokenHeader(req, token);
    }

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !cloned.url.includes('/auth/refresh')) {
          return this.handle401Error(cloned, next);
        } else {
          return throwError(error);
        }
      })
    );
  }
  private isExcluded(url: string): boolean {
    const isExcluded = this.excludedUrls.some(excludedUrl => url.includes(excludedUrl));
    return isExcluded;
  }

  public resetTokenState(): void {
    this.isRefreshing = false;
    this.refreshTokenSubject.next(null);
  }
  
  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((newToken: string) => {
          this.isRefreshing = false;
          this.authService.saveToken(newToken);
          this.refreshTokenSubject.next(newToken);
          return next.handle(this.addTokenHeader(request, newToken));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          this.router.navigate([''], { queryParams: { clear: true } });
          return throwError(error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        switchMap(token => {
          if (token !== null) {
            return next.handle(this.addTokenHeader(request, token));
          }
          return throwError('Token de atualização falhou');
        })
      );
    }
  }
}
