# Unauthorized Handling Documentation

This document explains the comprehensive unauthorized access handling system that automatically logs out users when they receive 401 responses.

## 🔒 Features

- ✅ **Automatic 401 Detection**: Intercepts all 401 responses from API calls
- ✅ **Complete State Cleanup**: Clears Redux state, localStorage, and persisted data
- ✅ **Token Management**: Removes auth tokens and clears axios headers
- ✅ **User Notifications**: Shows session expired messages
- ✅ **Automatic Redirect**: Redirects to login page
- ✅ **Route Protection**: Guards routes based on authentication and permissions
- ✅ **Manual Logout**: Provides functions for manual logout scenarios

## 🏗️ Architecture

### Core Components

1. **unauthorizedHandler.ts** - Central unauthorized handling logic
2. **useUnauthorizedHandler.ts** - React hook for unauthorized scenarios
3. **API Interceptors** - Automatic 401 response handling
4. **ProtectedRoute.tsx** - Route-level protection
5. **UnauthorizedTest.tsx** - Testing component

### Flow Diagram

```
API Call → 401 Response → Interceptor → Unauthorized Handler → Cleanup → Redirect
```

## 🔧 Implementation Details

### 1. API Interceptor Integration

The axios response interceptor automatically detects 401 responses:

```typescript
// In api.ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isUnauthorizedError(error)) {
      handleUnauthorized()
    }
    return Promise.reject(error)
  }
)
```

### 2. Unauthorized Handler

The central handler performs complete cleanup:

```typescript
export const handleUnauthorized = async (showNotification = true) => {
  // 1. Clear localStorage
  localStorage.removeItem('authToken')
  localStorage.removeItem('refreshToken')
  
  // 2. Clear persisted state
  await clearPersistedAuth()
  
  // 3. Dispatch Redux actions
  dispatch(logout())
  dispatch(addNotification({...}))
  
  // 4. Redirect to login
  window.location.href = '/signin'
}
```

### 3. React Hook Integration

The `useUnauthorizedHandler` hook provides React-friendly functions:

```typescript
const { handleUnauthorizedAccess, checkAndHandleUnauthorized, forceLogout } = useUnauthorizedHandler()

// Check and handle in error scenarios
const wasUnauthorized = checkAndHandleUnauthorized(error)

// Manual logout
await forceLogout('Session timeout')
```

### 4. useApi Hook Integration

The `useApi` hook automatically handles unauthorized errors:

```typescript
catch (error) {
  const wasUnauthorized = checkAndHandleUnauthorized(error)
  
  if (!wasUnauthorized) {
    // Handle other errors normally
    handleApiError(error)
  }
}
```

## 🛡️ Route Protection

### Basic Protection

```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### Role-Based Protection

```typescript
<ProtectedRoute requiredRole="Admin">
  <AdminPanel />
</ProtectedRoute>
```

### Permission-Based Protection

```typescript
<ProtectedRoute requiredPermissions={['read_users', 'write_users']}>
  <UserManagement />
</ProtectedRoute>
```

## 🧪 Testing Unauthorized Scenarios

The `UnauthorizedTest` component provides several test scenarios:

### 1. Simulate 401 API Call
```typescript
// Makes a request that returns 401
await api.get('/protected-endpoint-that-returns-401')
```

### 2. Simulate Token Expiration
```typescript
// Removes token and makes API call
localStorage.removeItem('authToken')
await api.get('/some-endpoint')
```

### 3. Manual Unauthorized
```typescript
// Directly triggers unauthorized handler
handleUnauthorizedAccess(true)
```

### 4. Force Logout
```typescript
// Manual logout with custom message
forceLogout('Testing force logout')
```

## 🔄 Cleanup Process

When unauthorized access is detected, the following cleanup occurs:

### 1. localStorage Cleanup
- `authToken` - JWT token
- `refreshToken` - Refresh token (if used)
- `persist:auth` - Persisted auth state
- `persist:root` - Root persisted state

### 2. Redux State Cleanup
- Dispatches `logout()` action
- Clears user data from auth slice
- Resets authentication status

### 3. Axios Cleanup
- Removes `Authorization` header
- Clears default headers

### 4. Persistence Cleanup
- Purges persisted auth data
- Maintains UI preferences (theme, sidebar)

### 5. User Feedback
- Shows "Session Expired" notification
- Provides clear messaging

### 6. Navigation
- Redirects to `/signin` page
- Replaces current history entry

## 🎯 Usage Examples

### In Components

```typescript
import { useUnauthorizedHandler } from '@/hooks/useUnauthorizedHandler'

const MyComponent = () => {
  const { checkAndHandleUnauthorized } = useUnauthorizedHandler()
  
  const handleApiCall = async () => {
    try {
      const data = await SomeService.getData()
    } catch (error) {
      if (!checkAndHandleUnauthorized(error)) {
        // Handle other errors
        console.error('API error:', error)
      }
    }
  }
}
```

### In Services

```typescript
// Services automatically handle 401 through interceptors
export class UserService {
  static async getUsers() {
    // If this returns 401, user will be automatically logged out
    return await apiMethods.get('/users')
  }
}
```

### Manual Logout

```typescript
import { useUnauthorizedHandler } from '@/hooks/useUnauthorizedHandler'

const LogoutButton = () => {
  const { forceLogout } = useUnauthorizedHandler()
  
  const handleLogout = () => {
    forceLogout('User clicked logout')
  }
  
  return <Button onClick={handleLogout}>Logout</Button>
}
```

## 🚨 Error Scenarios Handled

### 1. Token Expiration
- **Trigger**: JWT token expires
- **Detection**: 401 response from API
- **Action**: Automatic logout and redirect

### 2. Invalid Token
- **Trigger**: Token is malformed or invalid
- **Detection**: 401 response from API
- **Action**: Automatic logout and redirect

### 3. Revoked Access
- **Trigger**: User access revoked on backend
- **Detection**: 401 response from API
- **Action**: Automatic logout and redirect

### 4. Session Timeout
- **Trigger**: Server-side session expires
- **Detection**: 401 response from API
- **Action**: Automatic logout and redirect

### 5. Permission Changes
- **Trigger**: User permissions changed
- **Detection**: 403 or 401 response
- **Action**: Logout or permission error

## 🔍 Debugging

### Check Unauthorized Handling

```typescript
import { checkPersistenceHealth } from '@/store/persistUtils'

// Check if cleanup worked
const health = checkPersistenceHealth()
console.log('Persistence health:', health)

// Check localStorage
console.log('Auth token:', localStorage.getItem('authToken'))
console.log('Persisted auth:', localStorage.getItem('persist:auth'))
```

### Monitor Network Requests

1. Open browser DevTools
2. Go to Network tab
3. Look for 401 responses
4. Check if logout sequence triggers

### Test Scenarios

Use the `UnauthorizedTest` component on the dashboard to test all scenarios.

## 🛠️ Configuration

### Customize Redirect Path

```typescript
// In unauthorizedHandler.ts
window.location.href = '/custom-login-page'
```

### Customize Notification Messages

```typescript
dispatch(addNotification({
  type: 'warning',
  title: 'Custom Title',
  message: 'Custom session expired message',
}))
```

### Add Custom Cleanup Logic

```typescript
export const handleUnauthorized = async (showNotification = true) => {
  // Standard cleanup...
  
  // Custom cleanup
  customCleanupFunction()
  clearCustomCache()
  
  // Continue with redirect...
}
```

The unauthorized handling system provides comprehensive protection against unauthorized access and ensures a smooth user experience when sessions expire or access is revoked.
