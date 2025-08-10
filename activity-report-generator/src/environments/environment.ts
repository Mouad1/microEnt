// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth0: {
    domain: 'dev-33u6z9rl.us.auth0.com',
    clientId: 'DzcamW4rv7Iw4ItNne1Bp6JU90mLQIuD',
    redirectUri: window.location.origin,
    audience: undefined as string | undefined, // Only needed if you have a backend API
  },
};
