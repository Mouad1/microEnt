export const environment = {
  production: false,
  testing: true, // Add this flag for tests
  auth0: {
    domain: 'dev-33u6z9rl.us.auth0.com',
    clientId: 'DzcamW4rv7Iw4ItNne1Bp6JU90mLQIuD',
    redirectUri: window.location.origin,
    audience: undefined as string | undefined,
  },
};
