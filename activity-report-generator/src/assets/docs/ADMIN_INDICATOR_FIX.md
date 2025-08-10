# Fix Admin Indicator - Step by Step Guide

## The Problem

Your roles are named "Admin" and "User" (capital letters) but the app expects lowercase. Also, roles need to be included in the Auth0 token.

## Solution Steps

### Step 1: Create Auth0 Action to Include Roles in Token

1. **Go to Auth0 Dashboard** → **Actions** → **Flows** → **Login**
2. **Click "+"** to add a new action
3. **Click "Build from scratch"**
4. **Name**: `Add Roles to Token`
5. **Trigger**: `Login / Post Login`
6. **Runtime**: `Node 18`
7. **Click "Create"**

8. **Replace the code** with:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = "https://your-app.com/";

  // Get user roles from app_metadata
  const roles = event.user.app_metadata?.roles || ["user"];

  // Convert roles to lowercase for consistency
  const normalizedRoles = roles.map((role) => role.toLowerCase());

  console.log("User roles:", normalizedRoles); // Debug log

  // Add roles to both ID token and access token
  api.idToken.setCustomClaim(`${namespace}roles`, normalizedRoles);
  api.accessToken.setCustomClaim(`${namespace}roles`, normalizedRoles);
};
```

9. **Click "Deploy"**
10. **Go back to the Login flow**
11. **Drag the action** from the right sidebar into the flow (between "Start" and "Complete")
12. **Click "Apply"**

### Step 2: Verify User Roles in Auth0

1. **Go to User Management** → **Users**
2. **Find your admin user**
3. **Click on the user**
4. **Go to "Metadata" tab**
5. **In app_metadata**, ensure you have:

```json
{
  "roles": ["Admin"]
}
```

**Note**: Keep "Admin" with capital A - the Action will convert it to lowercase.

### Step 3: Test the Setup

1. **Logout** from your application
2. **Login again** (this triggers the new Action)
3. **Open browser console** (F12)
4. **Look for debug logs**:
   - "User object: {...}"
   - "Found roles: ['admin']"
   - "Header component - User roles: ['admin']"
   - "Header component - Is admin: true"

### Step 4: If Still Not Working - Check Token

1. **After login, open browser console**
2. **Go to Application tab** → **Local Storage** → **your domain**
3. **Look for Auth0 tokens**
4. **Copy the ID token** (long string starting with "eyJ")
5. **Go to [jwt.io](https://jwt.io)**
6. **Paste the token**
7. **Check if you see**:
   ```json
   {
     "https://your-app.com/roles": ["admin"]
   }
   ```

## Alternative: Quick Fix (Change User Role Format)

If you prefer to keep roles as lowercase in Auth0:

1. **Go to your admin user** in Auth0
2. **Change app_metadata to**:
   ```json
   {
     "roles": ["admin"]
   }
   ```
3. **Save and test again**

## Debugging Commands

Add this to your browser console after login to debug:

```javascript
// Check what's in localStorage
console.log("Auth0 tokens:", localStorage);

// Force check user roles
window.location.reload();
```

## Expected Behavior After Fix

✅ **Admin user should see**:

- 👑 Admin indicator in header
- Configuration link in navigation
- Console logs showing roles: ["admin"]

❌ **Regular user should see**:

- No admin indicator
- No configuration link
- Console logs showing roles: ["user"]

## If Admin Indicator Still Missing

1. **Clear browser cache completely**
2. **Logout and login again**
3. **Check console for errors**
4. **Verify the Auth0 Action is in the Login flow**
5. **Check that app_metadata has roles array**

The key is making sure the Auth0 Action runs and includes roles in the token!
