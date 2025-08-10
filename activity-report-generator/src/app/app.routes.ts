import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';
import { UserRole } from './shared/services/auth.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'activity-report',
    loadComponent: () =>
      import('./features/activity-report/activity-report.component').then(
        (m) => m.ActivityReportComponent
      ),
    // Activity report is public - accessible to all authenticated users
    canActivate: [AuthGuard],
  },
  {
    path: 'configuration',
    loadComponent: () =>
      import('./features/configuration/configuration.component').then(
        (m) => m.ConfigurationComponent
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] }, // Only admin can access
  },
  {
    path: 'documentation',
    loadComponent: () =>
      import(
        './features/documentation-viewer/documentation-viewer.component'
      ).then((m) => m.DocumentationViewerComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] }, // Only admin can access private docs
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },
  {
    path: 'ui-showcase',
    loadComponent: () =>
      import('./features/ui-showcase/ui-showcase.component').then(
        (m) => m.UiShowcaseComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
