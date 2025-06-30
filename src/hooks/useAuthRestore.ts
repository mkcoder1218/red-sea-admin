import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setAuthToken, clearAuthToken } from '@/lib/api'
import { logout } from '@/store/slices/authSlice'
import { config } from '@/lib/config'

/**
 * Hook to restore authentication state and sync with API instance
 * This ensures that the axios instance has the correct auth token
 * when the app loads from persisted state
 */
export const useAuthRestore = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem(config.storage.authToken)
    
    if (isAuthenticated && user && token) {
      // User is authenticated and we have a token, set it in axios
      setAuthToken(token)
    } else if (isAuthenticated && user && !token) {
      // User appears authenticated but no token found, logout
      console.warn('User authenticated but no token found, logging out')
      dispatch(logout())
      clearAuthToken()
    } else if (!isAuthenticated && token) {
      // No authenticated user but token exists, clear it
      console.warn('Token found but user not authenticated, clearing token')
      clearAuthToken()
    }
  }, [isAuthenticated, user, dispatch])

  return {
    isAuthenticated,
    user,
    isRestored: true, // Since we're using redux-persist, this will be true after rehydration
  }
}

/**
 * Hook to check if the persisted auth state is valid
 * This can be used to validate tokens on app startup
 */
export const useAuthValidation = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const validateAuth = async () => {
    if (!isAuthenticated || !user) {
      return false
    }

    const token = localStorage.getItem(config.storage.authToken)
    if (!token) {
      dispatch(logout())
      return false
    }

    try {
      // You can add an API call here to validate the token
      // const response = await AuthService.validateToken()
      // For now, we'll assume the token is valid if it exists
      setAuthToken(token)
      return true
    } catch (error) {
      console.error('Token validation failed:', error)
      dispatch(logout())
      clearAuthToken()
      return false
    }
  }

  return {
    validateAuth,
    isAuthenticated,
    user,
  }
}

export default useAuthRestore
