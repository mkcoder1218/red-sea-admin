# Redux Store Setup

This project uses Redux Toolkit for state management with properly typed hooks for TypeScript and Redux Persist for automatic state persistence.

## Structure

```
src/store/
├── index.ts              # Store configuration and types
├── hooks.ts              # Typed useAppSelector and useAppDispatch hooks
├── persistConfig.ts      # Redux Persist configuration
├── persistUtils.ts       # Persistence utility functions
├── slices/
│   ├── authSlice.ts      # Authentication state management
│   └── uiSlice.ts        # UI state management
├── README.md             # This file
└── PERSISTENCE_README.md # Detailed persistence documentation
```

## Usage

### Import the typed hooks

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks'
```

### Using useAppSelector

```typescript
// Get auth state
const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

// Get UI state
const { sidebarOpen, theme, notifications } = useAppSelector((state) => state.ui)

// Get specific values
const isLoggedIn = useAppSelector((state) => state.auth.isAuthenticated)
const currentTheme = useAppSelector((state) => state.ui.theme)
```

### Using useAppDispatch

```typescript
const dispatch = useAppDispatch()

// Dispatch auth actions
dispatch(loginStart())
dispatch(loginSuccess(user))
dispatch(logout())

// Dispatch UI actions
dispatch(toggleSidebar())
dispatch(addNotification({ type: 'success', title: 'Success!', message: 'Action completed' }))
dispatch(setTheme('dark'))
```

## Available Actions

### Auth Slice Actions

- `loginStart()` - Set loading state to true
- `loginSuccess(user)` - Set user and authenticated state
- `loginFailure(error)` - Set error state
- `logout()` - Clear user and reset auth state
- `clearError()` - Clear error message
- `updateUser(userData)` - Update user information

### UI Slice Actions

- `toggleSidebar()` - Toggle sidebar open/closed
- `setSidebarOpen(boolean)` - Set sidebar state
- `setTheme('light' | 'dark' | 'system')` - Set theme
- `addNotification(notification)` - Add notification
- `markNotificationAsRead(id)` - Mark notification as read
- `removeNotification(id)` - Remove notification
- `clearAllNotifications()` - Clear all notifications
- `setLoading({ key, loading })` - Set loading state for specific key
- `clearLoading(key)` - Clear loading state
- `openModal(modalId)` - Open modal
- `closeModal(modalId)` - Close modal
- `toggleModal(modalId)` - Toggle modal state

## State Types

### Auth State

```typescript
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}
```

### UI State

```typescript
interface UiState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  notifications: Notification[]
  loading: { [key: string]: boolean }
  modals: { [key: string]: boolean }
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  read: boolean
}
```

## Adding New Slices

1. Create a new slice file in `src/store/slices/`
2. Import and add the reducer to the store in `src/store/index.ts`
3. The types will be automatically inferred in the hooks

Example:

```typescript
// src/store/slices/newSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NewState {
  // Define your state shape
}

const initialState: NewState = {
  // Initial state
}

export const newSlice = createSlice({
  name: 'new',
  initialState,
  reducers: {
    // Define your reducers
  },
})

export const { /* export actions */ } = newSlice.actions
export default newSlice.reducer
```

```typescript
// src/store/index.ts
import newReducer from './slices/newSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    new: newReducer, // Add your new reducer
  },
  // ... rest of configuration
})
```

## Best Practices

1. Always use the typed hooks (`useAppSelector`, `useAppDispatch`) instead of the plain Redux hooks
2. Keep slices focused on a single domain of state
3. Use Redux Toolkit's `createSlice` for all state management
4. Prefer specific selectors over selecting the entire state
5. Use the `loading` object in UI slice for managing loading states across the app
6. Use the notification system for user feedback

## Example Component

See `src/components/ReduxExample.tsx` for a complete example of how to use the Redux store in a component.
