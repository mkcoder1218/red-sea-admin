import storage from 'redux-persist/lib/storage'
import { PersistConfig } from 'redux-persist'
import { RootState } from './index'

// Auth persist configuration - persist everything in auth state
const authPersistConfig: PersistConfig<any> = {
  key: 'auth',
  storage,
  // Persist all auth state
  whitelist: ['user', 'isAuthenticated', 'error'], // Don't persist loading state
}

// UI persist configuration - only persist certain UI preferences
const uiPersistConfig: PersistConfig<any> = {
  key: 'ui',
  storage,
  // Only persist user preferences, not temporary states
  whitelist: ['theme', 'sidebarOpen'],
  // Don't persist notifications, loading states, or modals
  blacklist: ['notifications', 'loading', 'modals'],
}

// Products persist configuration - don't persist loading states
const productsPersistConfig: PersistConfig<any> = {
  key: 'products',
  storage,
  // Persist filters and pagination but not loading states or actual products data
  whitelist: ['filters', 'pagination'],
  // Don't persist products data, loading states, or errors (they should be fresh on reload)
  blacklist: ['products', 'loading', 'error'],
}

// Root persist configuration
export const persistConfig: PersistConfig<RootState> = {
  key: 'Red sea -admin',
  storage,
  // Define which top-level state slices to persist
  whitelist: ['auth'], // Only persist auth at root level
  // UI state will be handled by its own nested config if needed
}

export { authPersistConfig, uiPersistConfig, productsPersistConfig }
