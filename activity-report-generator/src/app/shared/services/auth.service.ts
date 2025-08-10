import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable, map } from 'rxjs';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface UserProfile {
  email?: string;
  name?: string;
  picture?: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly auth0: Auth0Service) {}

  /**
   * Check if user is authenticated
   */
  get isAuthenticated$(): Observable<boolean> {
    return this.auth0.isAuthenticated$;
  }

  /**
   * Get user profile
   */
  get user$(): Observable<UserProfile | null | undefined> {
    return this.auth0.user$;
  }

  /**
   * Login with Auth0
   */
  login(): void {
    this.auth0.loginWithRedirect();
  }

  /**
   * Logout from Auth0
   */
  logout(): void {
    this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  /**
   * Get user roles from Auth0 user metadata
   * In Auth0, roles can be stored in user metadata or in custom claims
   */
  getUserRoles(): Observable<string[]> {
    return this.auth0.user$.pipe(
      map((user) => {
        if (!user) return [];

        console.log('User object:', user); // Debug log

        // Check for roles in multiple locations
        const customClaims = user['https://wreport.belghitis.com/roles'] || [];
        const appMetadata = user['app_metadata']?.roles || [];
        const userMetadata = user['user_metadata']?.roles || [];

        // Combine all possible role sources
        let roles = [...customClaims, ...appMetadata, ...userMetadata];

        // Convert roles to lowercase for case-insensitive comparison
        roles = roles.map((role) => role.toLowerCase());

        console.log('Found roles:', roles); // Debug log

        // Fallback to a default role if no roles are assigned
        return roles.length > 0 ? roles : [UserRole.USER];
      })
    );
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole): Observable<boolean> {
    return this.getUserRoles().pipe(map((roles) => roles.includes(role)));
  }

  /**
   * Check if user is admin
   */
  isAdmin(): Observable<boolean> {
    return this.hasRole(UserRole.ADMIN);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): Observable<boolean> {
    return this.getUserRoles().pipe(
      map((userRoles) => roles.some((role) => userRoles.includes(role)))
    );
  }

  /**
   * Get access token for API calls
   * Note: This requires an audience to be configured in environment
   */
  getAccessToken(): Observable<string> {
    return this.auth0.getAccessTokenSilently();
  }
}
