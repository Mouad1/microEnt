# User Management Guide for Testing

## Creating Test Users in Auth0

### Method 1: Create Users Directly in Auth0 Dashboard

#### Step 1: Create Admin User

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **User Management** → **Users**
3. Click **Create User**
4. Fill in:
   - **Email**: `admin@test.com` (or your preferred admin email)
   - **Password**: Create a secure password
   - **Connection**: Database (Username-Password-Authentication)
5. Click **Create**

#### Step 2: Assign Admin Role

1. Click on the newly created admin user
2. Go to the **Metadata** tab
3. In the **app_metadata** section, add:
   ```json
   {
     "roles": ["admin"]
   }
   ```
4. Click **Save**

#### Step 3: Create Normal User

1. Go back to **User Management** → **Users**
2. Click **Create User** again
3. Fill in:
   - **Email**: `user@test.com` (or your preferred user email)
   - **Password**: Create a secure password
   - **Connection**: Database (Username-Password-Authentication)
4. Click **Create**

#### Step 4: Assign User Role (Optional)

1. Click on the newly created normal user
2. Go to the **Metadata** tab
3. In the **app_metadata** section, add:
   ```json
   {
     "roles": ["user"]
   }
   ```
4. Click **Save**

   **Note**: If you don't add this, the user will get the default "user" role automatically.

### Method 2: Let Users Sign Up and Manually Assign Roles

#### Step 1: Enable Signup in Auth0

1. Go to **Authentication** → **Database** → **Username-Password-Authentication**
2. Ensure **Disable Sign Ups** is turned OFF
3. Save changes

#### Step 2: Test Signup

1. Go to your application (`http://localhost:4200`)
2. Click **Login**
3. On the Auth0 login page, click **Sign up**
4. Create accounts with different emails

#### Step 3: Assign Roles After Signup

1. Go back to Auth0 Dashboard → **User Management** → **Users**
2. Find the user you want to make admin
3. Follow the metadata steps above to assign roles

## Testing Different Access Levels

### Admin User Test Checklist:

- ✅ Can access Dashboard
- ✅ Can access Activity Report
- ✅ Can access Configuration (admin-only)
- ✅ Sees "👑 Admin" indicator in header
- ✅ Sees Configuration link in navigation

### Normal User Test Checklist:

- ✅ Can access Dashboard
- ✅ Can access Activity Report
- ❌ Cannot access Configuration (should redirect to /unauthorized)
- ❌ Does not see "👑 Admin" indicator
- ❌ Does not see Configuration link in navigation

## Quick Test Users (Pre-configured)

You can create these test accounts quickly:

### Admin Account

- **Email**: `admin.test@yourapp.com`
- **Password**: `AdminTest123!`
- **Metadata**:
  ```json
  {
    "roles": ["admin"]
  }
  ```

### Normal User Account

- **Email**: `user.test@yourapp.com`
- **Password**: `UserTest123!`
- **Metadata**:
  ```json
  {
    "roles": ["user"]
  }
  ```

## Role Assignment Automation (Advanced)

If you want to automate role assignment, you can use Auth0 Actions:

### Create an Action for Default Role Assignment

1. Go to **Actions** → **Flows** → **Post User Registration**
2. Create a new Action:

```javascript
exports.onExecutePostUserRegistration = async (event, api) => {
  // Assign default role to new users
  const defaultRole = event.user.email.includes("admin") ? "admin" : "user";

  api.user.setAppMetadata("roles", [defaultRole]);
};
```

3. Add this action to your Post User Registration flow

This will automatically assign:

- `admin` role to emails containing "admin"
- `user` role to all other emails

## Troubleshooting

### Issue: Roles Not Appearing

**Solution**: Check that you've set up the Auth0 Action to include roles in tokens:

1. Go to **Actions** → **Flows** → **Login**
2. Ensure you have an action with this code:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = "https://your-app.com/";
  const roles = event.user.app_metadata?.roles || ["user"];

  api.idToken.setCustomClaim(`${namespace}roles`, roles);
  api.accessToken.setCustomClaim(`${namespace}roles`, roles);
};
```

### Issue: Configuration Page Still Accessible

**Solution**: Clear browser cache and check that guards are properly imported in routes.

### Issue: Admin Indicator Not Showing

**Solution**: Verify the user has the correct role in app_metadata and the Auth0 Action is running.

## Security Best Practices

1. **Use Strong Passwords**: For test accounts, use secure passwords
2. **Limit Admin Users**: Only assign admin role to trusted accounts
3. **Regular Cleanup**: Remove test users from production
4. **Monitor Access**: Check Auth0 logs for unauthorized access attempts
5. **Role Validation**: Always validate roles on both frontend and backend
