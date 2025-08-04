import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ButtonComponent, CardComponent, BadgeComponent } from '../../ui';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  available: boolean;
  comingSoon?: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
  ],
})
export class DashboardComponent {
  features: FeatureCard[] = [
    {
      id: 'activity-report',
      title: 'Activity Report',
      description: 'Generate monthly activity reports for your clients',
      icon: '📊',
      route: '/activity-report',
      available: true,
    },
    {
      id: 'ui-showcase',
      title: 'UI Components Library',
      description:
        'Explore and test all available UI components and their variations',
      icon: '🎨',
      route: '/ui-showcase',
      available: true,
    },
    {
      id: 'bill-generation',
      title: 'Bill Generation',
      description: 'Create and manage invoices for your services',
      icon: '🧾',
      route: '/bills',
      available: false,
      comingSoon: true,
    },
    {
      id: 'freelance-charges',
      title: 'Freelance Charges Simulation',
      description: 'Calculate and simulate freelance charges and rates',
      icon: '💰',
      route: '/freelance-simulator',
      available: false,
      comingSoon: true,
    },
    {
      id: 'ca-simulation',
      title: 'CA Simulation',
      description: 'Simulate your annual revenue and tax calculations',
      icon: '📈',
      route: '/ca-simulator',
      available: false,
      comingSoon: true,
    },
  ];

  constructor(private readonly router: Router) {}

  navigateToFeature(feature: FeatureCard): void {
    if (feature.available) {
      this.router.navigate([feature.route]);
    }
  }
}
