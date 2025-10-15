import { config } from './config'
import { clearPersistedAuth } from '@/store/persistUtils'

// Store reference for dispatching actions
let storeDispatch: any = null

/**
 * Set the store dispatch function for unauthorized handling
 * This should be called when the store is created
 */
export const setStoreDispatch = (dispatch: any) => {
  storeDispatch = dispatch
}

/**
 * Handle unauthorized access (401 responses)
 * This function will:
 * 1. Clear all authentication data
 * 2. Clear persisted state
 * 3. Dispatch logout action
 * 4. Redirect to login page
 * 5. Show notification
 */
export const handleUnauthorized = async (showNotification = true) => {
  console.warn('Unauthorized access detected, logging out user')
  
  try {
    // Clear all auth-related localStorage items
    const authKeys = [
      config.storage.authToken,
      config.storage.refreshToken,
      config.storage.persistAuth,
      config.storage.persistRoot,
    ]
    
    authKeys.forEach(key => {
      localStorage.removeItem(key)
    })
    
    // Clear axios auth header
    if (typeof window !== 'undefined' && (window as any).axios) {
      delete (window as any).axios.defaults.headers.common['Authorization']
    }
    
    // Clear persisted auth state
    await clearPersistedAuth()
    
    // Dispatch logout action if store is available
    if (storeDispatch) {
      // Import actions dynamically to avoid circular dependencies
      const { logout } = await import('@/store/slices/authSlice')
      const { addNotification } = await import('@/store/slices/uiSlice')
      
      storeDispatch(logout())
      
      if (showNotification) {
        storeDispatch(addNotification({
          type: 'warning',
          title: 'Session Expired',
          message: 'Your session has expired. Please log in again.',
        }))
      }
    }
    
    // Small delay to allow state updates

    
  } catch (error) {
    console.error('Error during unauthorized handling:', error)
    
    // Fallback: force redirect even if cleanup fails
    if (typeof window !== 'undefined') {
      window.location.href = '/signin'
    }
  }
}

/**
 * Check if the current error is an unauthorized error
 */
export const isUnauthorizedError = (error: any): boolean => {
  return error?.response?.status === 401 || 
         error?.status === 401 || 
         error?.code === 'UNAUTHORIZED'
}

/**
 * Enhanced error handler that checks for unauthorized access
 */
export const handleApiError = (error: any) => {
  if (isUnauthorizedError(error)) {
    handleUnauthorized()
    return {
      message: 'Session expired. Please log in again.',
      status: 401,
    }
  }
  
  // Return original error for other cases
  return {
    message: error?.response?.data?.message || error?.message || 'An error occurred',
    status: error?.response?.status || 500,
    errors: error?.response?.data?.errors,
  }
}

export default {
  setStoreDispatch,
  handleUnauthorized,
  isUnauthorizedError,
  handleApiError,
}
