import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import productsReducer from './slices/productsSlice'
import { persistConfig, authPersistConfig, uiPersistConfig, productsPersistConfig } from './persistConfig'
import { setStoreDispatch } from '@/lib/unauthorizedHandler'

// Create persisted reducers with individual configurations
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)
const persistedUiReducer = persistReducer(uiPersistConfig, uiReducer)
const persistedProductsReducer = persistReducer(productsPersistConfig, productsReducer)

// Combine reducers with their persisted versions
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  ui: persistedUiReducer,
  products: persistedProductsReducer,
})

// Create the final persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// Create persistor
export const persistor = persistStore(store)

// Register store dispatch with unauthorized handler
setStoreDispatch(store.dispatch)

// Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
