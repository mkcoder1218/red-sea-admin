import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'

export interface Role {
  id: string
  name: string
  description: string
  type: string
  access_rules: string[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface User {
  id: string
  social_login: string | null
  social_login_id: string | null
  email: string
  verification_code: string
  verification_time: string
  recovery_request_time: string | null
  recovery_time: string | null
  phone_number: string
  first_name: string
  last_name: string
  status: string
  type: string
  pref_language: string
  pref_currency: string
  pref_unit: string
  is_verified: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  role_id: string
  role: Role
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.user = null
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      // Handle rehydration from redux-persist
      if (action.payload && (action.payload as any).auth) {
        const persistedAuth = (action.payload as any).auth
        // Only restore if we have a valid user and authentication state
        if (persistedAuth.user && persistedAuth.isAuthenticated) {
          state.user = persistedAuth.user
          state.isAuthenticated = persistedAuth.isAuthenticated
          state.error = persistedAuth.error || null
          // Don't restore loading state
          state.isLoading = false
        }
      }
    })
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
} = authSlice.actions

export default authSlice.reducer
