# Auth0 Setup Guide

This application uses Auth0 for authentication and role-based access control. Follow these steps to set up Auth0 integration.

## 1. Auth0 Application Setup

### Create an Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Applications**
3. Click **Create Application**
4. Choose **Single Page Web Applications** and click **Create**

### Configure Application Settings

1. In your application settings, configure the following:

   - **Allowed Callback URLs**: `http://localhost:4200`
   - **Allowed Logout URLs**: `http://localhost:4200`
   - **Allowed Web Origins**: `http://localhost:4200`
   - **Allowed Origins (CORS)**: `http://localhost:4200`

2. Note down:
   - **Domain** (e.g., `your-tenant.auth0.com`)
   - **Client ID**

## 2. Environment Configuration

Update the environment files with your Auth0 configuration:

### `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  auth0: {
    domain: "YOUR_AUTH0_DOMAIN",
    clientId: "YOUR_AUTH0_CLIENT_ID",
    redirectUri: window.location.origin,
    audience: "YOUR_AUTH0_API_IDENTIFIER", // Optional
  },
};
```

### `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  auth0: {
    domain: "YOUR_AUTH0_DOMAIN",
    clientId: "YOUR_AUTH0_CLIENT_ID",
    redirectUri: window.location.origin,
    audience: "YOUR_AUTH0_API_IDENTIFIER", // Optional
  },
};
```

## 3. User Roles Setup

This application supports two roles:

- **admin**: Full access including configuration section
- **user**: Dashboard and public modules access

### Option 1: Using Auth0 Authorization Extension (Deprecated but still functional)

1. Install the Authorization Extension from the Auth0 Dashboard
2. Create roles: `admin` and `user`
3. Assign users to roles
4. Add a rule to include roles in the token

### Option 2: Using Auth0 Actions (Recommended)

1. Go to **Actions** → **Flows** → **Login**
2. Create a new Action with the following code:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = "https://your-app.com/";

  // Get user roles from app_metadata
  const roles = event.user.app_metadata?.roles || ["user"];

  // Convert roles to lowercase for consistency (handles "Admin" → "admin")
  const normalizedRoles = roles.map((role) => role.toLowerCase());

  // Add roles to the token
  api.idToken.setCustomClaim(`${namespace}roles`, normalizedRoles);
  api.accessToken.setCustomClaim(`${namespace}roles`, normalizedRoles);
};
```

3. Add this action to your login flow

### Option 3: Manual Role Assignment via Auth0 Dashboard

1. Go to **User Management** → **Users**
2. Select a user
3. Go to the **Metadata** tab
4. Add to `app_metadata`:

```json
{
  "roles": ["admin"]
}
```

## 4. Testing the Setup

1. Start the application: `npm start`
2. Navigate to `http://localhost:4200`
3. You should see a login button
4. After login, users will be redirected based on their roles:
   - **Admin users**: Can access Configuration section
   - **Regular users**: Can access Dashboard and Activity Report

## 5. Role-Based Access Control

### Current Route Protection:

- `/dashboard` - Requires authentication
- `/activity-report` - Requires authentication (public to all authenticated users)
- `/configuration` - Requires authentication + admin role
- `/unauthorized` - Public access for unauthorized role access attempts

### Adding New Protected Routes:

```typescript
{
  path: 'new-admin-route',
  component: YourComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: [UserRole.ADMIN] }
}
```

## 6. Customization

### Adding New Roles:

1. Update the `UserRole` enum in `src/app/shared/services/auth.service.ts`
2. Assign the new role to users in Auth0
3. Update route protection as needed

### Customizing User Role Resolution:

Modify the `getUserRoles()` method in `AuthService` to match your Auth0 setup:

```typescript
getUserRoles(): Observable<string[]> {
  return this.auth0.user$.pipe(
    map(user => {
      if (!user) return [];

      // Customize this based on how you store roles in Auth0
      const customClaims = user['https://your-app.com/roles'] ||
                          user['app_metadata']?.roles ||
                          user['user_metadata']?.roles || [];

      return customClaims.length > 0 ? customClaims : [UserRole.USER];
    })
  );
}
```

## 7. Production Deployment

1. Update production environment with production Auth0 settings
2. Configure allowed URLs in Auth0 for your production domain
3. Ensure HTTPS is enabled for production

## Troubleshooting

### Common Issues:

1. **Login redirect loops**: Check allowed callback URLs in Auth0
2. **CORS errors**: Verify allowed origins in Auth0 settings
3. **Roles not appearing**: Check Auth0 Actions/Rules and custom claims namespace
4. **Unauthorized access**: Verify role assignment in Auth0 user metadata

### Debug Tips:

1. Check browser console for Auth0 errors
2. Verify token content at [jwt.io](https://jwt.io)
3. Check Auth0 logs in the Dashboard
4. Use Auth0's Real-time Webtask Logs for debugging Actions/Rules
