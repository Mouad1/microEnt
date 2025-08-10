import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { routes } from './app/app.routes';
import { provideAuth0 } from '@auth0/auth0-angular';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    FormBuilder,
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: environment.auth0.redirectUri,
        ...(environment.auth0.audience && {
          audience: environment.auth0.audience,
        }),
        scope: 'openid profile email',
      },
    }),
  ],
}).catch((err) => console.error(err));
