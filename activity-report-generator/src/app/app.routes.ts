import { Routes } from '@angular/router';

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
  },
  {
    path: 'activity-report',
    loadComponent: () =>
      import('./features/activity-report/activity-report.component').then(
        (m) => m.ActivityReportComponent
      ),
  },
  {
    path: 'ui-showcase',
    loadComponent: () =>
      import('./features/ui-showcase/ui-showcase.component').then(
        (m) => m.UiShowcaseComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
