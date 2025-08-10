import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService, UserRole } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const allowedRoles = route.data['roles'] as UserRole[];

    if (!allowedRoles || allowedRoles.length === 0) {
      return this.authService.isAuthenticated$;
    }

    return this.authService.hasAnyRole(allowedRoles).pipe(
      tap((hasRole) => {
        if (!hasRole) {
          this.router.navigate(['/unauthorized']);
        }
      })
    );
  }
}
