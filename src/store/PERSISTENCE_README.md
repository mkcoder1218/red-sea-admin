# Redux Persistence Setup

This project uses Redux Persist to automatically save and restore Redux state across browser sessions. The setup is configured to persist authentication state while keeping UI state like notifications and loading states ephemeral.

## Features

- ✅ Automatic state persistence to localStorage
- ✅ Selective persistence (auth state persisted, UI state partially persisted)
- ✅ Auth token restoration and API synchronization
- ✅ Rehydration handling with loading states
- ✅ TypeScript support
- ✅ Persistence utilities for manual control
- ✅ Error handling and recovery

## Architecture

### Persistence Configuration

```
src/store/
├── index.ts              # Main store with persistence
├── persistConfig.ts      # Persistence configuration
├── persistUtils.ts       # Utility functions
├── slices/
│   ├── authSlice.ts     # Auth state (fully persisted)
│   └── uiSlice.ts       # UI state (partially persisted)
└── PERSISTENCE_README.md # This file
```

### What Gets Persisted

#### Auth State (Fully Persisted)
- ✅ `user` - User information
- ✅ `isAuthenticated` - Authentication status
- ✅ `error` - Auth errors
- ❌ `isLoading` - Loading states (ephemeral)

#### UI State (Partially Persisted)
- ✅ `theme` - User theme preference
- ✅ `sidebarOpen` - Sidebar state
- ❌ `notifications` - Notifications (ephemeral)
- ❌ `loading` - Loading states (ephemeral)
- ❌ `modals` - Modal states (ephemeral)

## Configuration

### Persist Config Structure

```typescript
// Root persistence config
const persistConfig = {
  key: 'Red sea -admin',
  storage: localStorage,
  whitelist: ['auth'], // Only persist auth at root level
}

// Auth-specific config
const authPersistConfig = {
  key: 'auth',
  storage: localStorage,
  whitelist: ['user', 'isAuthenticated', 'error'],
}

// UI-specific config
const uiPersistConfig = {
  key: 'ui',
  storage: localStorage,
  whitelist: ['theme', 'sidebarOpen'],
  blacklist: ['notifications', 'loading', 'modals'],
}
```

## Usage

### Automatic Persistence

State is automatically persisted when it changes:

```typescript
// This will be automatically persisted
dispatch(loginSuccess(user))
dispatch(setTheme('dark'))
dispatch(setSidebarOpen(false))

// These will NOT be persisted
dispatch(addNotification({ ... }))
dispatch(setLoading({ key: 'users', loading: true }))
```

### Manual Persistence Control

```typescript
import { 
  flushPersist, 
  purgePersist, 
  clearPersistedAuth,
  resetAppState 
} from '@/store/persistUtils'

// Force save current state
await flushPersist()

// Clear all persisted state
await purgePersist()

// Clear only auth state
await clearPersistedAuth()

// Reset entire app
await resetAppState()
```

### Auth Token Restoration

The `useAuthRestore` hook automatically:
1. Checks for persisted auth state
2. Validates auth token in localStorage
3. Synchronizes token with Axios instance
4. Handles token/state mismatches

```typescript
import { useAuthRestore } from '@/hooks/useAuthRestore'

const MyComponent = () => {
  const { isAuthenticated, user, isRestored } = useAuthRestore()
  
  // Component logic here
}
```

## Components

### PersistGate

Wraps the app to handle rehydration:

```typescript
<PersistGate loading={<PersistLoader />} persistor={persistor}>
  <App />
</PersistGate>
```

### AuthProvider

Handles auth restoration and token synchronization:

```typescript
<AuthProvider>
  <App />
</AuthProvider>
```

### PersistLoader

Custom loading component shown during rehydration:

```typescript
const PersistLoader = () => (
  <div className="loading-screen">
    <Loader2 className="animate-spin" />
    <p>Restoring your session...</p>
  </div>
)
```

## State Rehydration

### REHYDRATE Action

The auth slice handles the REHYDRATE action to ensure clean state restoration:

```typescript
extraReducers: (builder) => {
  builder.addCase(REHYDRATE, (state, action) => {
    if (action.payload?.auth) {
      const persistedAuth = action.payload.auth
      if (persistedAuth.user && persistedAuth.isAuthenticated) {
        state.user = persistedAuth.user
        state.isAuthenticated = persistedAuth.isAuthenticated
        state.error = persistedAuth.error || null
        state.isLoading = false // Always reset loading
      }
    }
  })
}
```

## Error Handling

### Token Validation

```typescript
// Check if persisted auth state is valid
const validateAuth = async () => {
  const token = localStorage.getItem('authToken')
  if (!token && isAuthenticated) {
    // State mismatch - clear auth
    dispatch(logout())
    return false
  }
  return true
}
```

### Recovery Strategies

1. **Token Missing**: Clear auth state and redirect to login
2. **Invalid Token**: Attempt refresh or force logout
3. **Corrupted State**: Purge persistence and restart
4. **Storage Full**: Clear old data and retry

## Best Practices

### Do's ✅

1. **Persist User Preferences**: Theme, sidebar state, settings
2. **Persist Auth State**: User info, authentication status
3. **Use Selective Persistence**: Only persist what's needed
4. **Handle Rehydration**: Show loading states during restoration
5. **Validate Restored State**: Check for consistency
6. **Clear on Logout**: Remove sensitive persisted data

### Don'ts ❌

1. **Don't Persist Sensitive Data**: Passwords, full tokens
2. **Don't Persist Temporary State**: Loading, notifications, modals
3. **Don't Persist Large Objects**: Keep storage lean
4. **Don't Ignore Errors**: Handle persistence failures gracefully
5. **Don't Block UI**: Use async operations for persistence

## Debugging

### Check Persistence Health

```typescript
import { checkPersistenceHealth } from '@/store/persistUtils'

const health = checkPersistenceHealth()
console.log('Persistence Health:', health)
```

### Inspect localStorage

```javascript
// View all persisted data
Object.keys(localStorage)
  .filter(key => key.startsWith('persist:'))
  .forEach(key => {
    console.log(key, JSON.parse(localStorage.getItem(key)))
  })
```

### Clear Specific Data

```typescript
// Clear specific persistence keys
localStorage.removeItem('persist:auth')
localStorage.removeItem('persist:ui')
localStorage.removeItem('persist:Red sea -admin')
```

## Migration

### Version Updates

When updating the app structure, you may need to migrate persisted data:

```typescript
// Add version to persist config
const persistConfig = {
  key: 'Red sea -admin',
  version: 1,
  storage,
  migrate: (state, version) => {
    // Handle migration logic
    if (version === 0) {
      // Migrate from v0 to v1
      return migrateV0ToV1(state)
    }
    return state
  }
}
```

## Testing

### Test Persistence

1. Login and set preferences
2. Refresh the page
3. Verify state is restored
4. Test logout clears persisted auth
5. Test theme/sidebar persistence

### Example Component

See `src/components/PersistenceExample.tsx` for a complete demonstration of persistence features.

## Troubleshooting

### Common Issues

1. **State Not Persisting**: Check whitelist/blacklist configuration
2. **Auth Not Restored**: Verify token synchronization
3. **Storage Errors**: Check localStorage availability
4. **Performance Issues**: Reduce persisted data size
5. **Hydration Errors**: Handle async rehydration properly

### Solutions

1. **Clear All Data**: Use `resetAppState()` utility
2. **Selective Clear**: Use `clearPersistedAuth()` for auth issues
3. **Force Flush**: Use `flushPersist()` to save immediately
4. **Check Health**: Use `checkPersistenceHealth()` for diagnostics
