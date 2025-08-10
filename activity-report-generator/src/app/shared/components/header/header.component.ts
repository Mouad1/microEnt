import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  user$: Observable<any>;
  isAdmin$: Observable<boolean>;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly auth0: Auth0Service
  ) {
    this.isAuthenticated$ = this.auth0.isAuthenticated$;
    this.user$ = this.auth0.user$;
    this.isAdmin$ = this.authService.isAdmin();
  }

  ngOnInit(): void {
    // Debug: Log user roles when component initializes
    this.authService.getUserRoles().subscribe((roles) => {
      console.log('Header component - User roles:', roles);
    });

    this.isAdmin$.subscribe((isAdmin) => {
      console.log('Header component - Is admin:', isAdmin);
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }
}
