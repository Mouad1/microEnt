import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, tap, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean> {
    // Check for e2e test bypass
    const testBypass = this.isTestEnvironment();
    if (testBypass) {
      console.log('🔓 AuthGuard bypassed for e2e testing');
      return of(true);
    }

    return this.auth.isAuthenticated$.pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.auth.loginWithRedirect();
        }
      })
    );
  }

  private isTestEnvironment(): boolean {
    // Check multiple test indicators
    return (
      // Environment flag
      (environment as any).testing === true ||
      // Window flag set by e2e tests
      (typeof window !== 'undefined' && (window as any).e2eTestMode === true) ||
      // Local storage flag
      (typeof localStorage !== 'undefined' && localStorage.getItem('e2e_test_mode') === 'true') ||
      // URL parameter for e2e tests
      (typeof window !== 'undefined' && window.location.search.includes('e2e=true'))
    );
  }
}
