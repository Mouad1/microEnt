import { Page } from '@playwright/test';

export class AuthHelper {
  constructor(private readonly page: Page) {}

  /**
   * Mock authentication by setting localStorage tokens
   * This simulates a logged-in user without going through Auth0
   */
  async mockAuthentication(userRole: 'admin' | 'user' = 'user') {
    // Mock Auth0 tokens in localStorage
    const mockTokens = {
      accessToken: 'mock-access-token',
      idToken: 'mock-id-token',
      user: {
        sub: 'auth0|123456789',
        name: 'Test User',
        email: 'test@example.com',
        email_verified: true,
        picture: 'https://example.com/avatar.jpg',
        'https://myapp.com/roles': userRole === 'admin' ? ['admin'] : ['user'],
      },
      expiresAt: Date.now() + 3600000, // 1 hour from now
    };

    // Set authentication state before page loads
    await this.page.addInitScript((tokens) => {
      // Mock Auth0 state
      localStorage.setItem('auth0.spajs.auth.token', JSON.stringify(tokens));
      localStorage.setItem('auth0.is.authenticated', 'true');

      // Mock Angular auth state
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem(
        'userRole',
        tokens.user['https://myapp.com/roles'][0]
      );

      // Override Auth0 isAuthenticated check
      (window as any).mockAuthState = {
        isAuthenticated: true,
        user: tokens.user,
        token: tokens.accessToken,
      };
    }, mockTokens);

    console.log(`🔐 Mock authentication set for: ${userRole}`);
  }

  /**
   * Check if we're on Auth0 login page
   */
  async isOnAuth0LoginPage(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('auth0.com') || url.includes('/login');
  }

  /**
   * Wait for authentication redirect or app load
   */
  async waitForAuthenticationOrApp() {
    await this.page.waitForLoadState('networkidle');

    if (await this.isOnAuth0LoginPage()) {
      console.log('🔐 Redirected to Auth0 login (expected behavior)');
      return 'auth0';
    } else {
      console.log('✅ App loaded successfully');
      return 'app';
    }
  }

  /**
   * Handle login form if present (for testing login flow)
   */
  async fillLoginForm(email: string, password: string) {
    if (await this.isOnAuth0LoginPage()) {
      // Fill Auth0 login form
      await this.page.fill('input[name="email"], input[type="email"]', email);
      await this.page.fill(
        'input[name="password"], input[type="password"]',
        password
      );
      await this.page.click('button[type="submit"], .auth0-lock-submit');

      // Wait for redirect back to app
      await this.page.waitForLoadState('networkidle');
    }
  }
}
