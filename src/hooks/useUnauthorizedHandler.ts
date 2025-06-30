import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { addNotification } from '@/store/slices/uiSlice'
import { handleUnauthorized } from '@/lib/unauthorizedHandler'

/**
 * Hook to handle unauthorized access scenarios
 * Provides functions to manually trigger logout and handle 401 errors
 */
export const useUnauthorizedHandler = () => {
  const dispatch = useAppDispatch()

  /**
   * Handle unauthorized access with Redux integration
   * This will clear all auth data and redirect to login
   */
  const handleUnauthorizedAccess = useCallback(async (showNotification = true) => {
    try {
      // Dispatch logout action
      dispatch(logout())
      
      // Show notification if requested
      if (showNotification) {
        dispatch(addNotification({
          type: 'warning',
          title: 'Session Expired',
          message: 'Your session has expired. Please log in again.',
        }))
      }
      
      // Use the centralized unauthorized handler
      await handleUnauthorized(false) // Don't show notification again
      
    } catch (error) {
      console.error('Error handling unauthorized access:', error)
      
      // Fallback: force redirect
      window.location.href = '/signin'
    }
  }, [dispatch])

  /**
   * Check if an error is unauthorized and handle it
   */
  const checkAndHandleUnauthorized = useCallback((error: any) => {
    if (error?.response?.status === 401 || error?.status === 401) {
      handleUnauthorizedAccess()
      return true
    }
    return false
  }, [handleUnauthorizedAccess])

  /**
   * Manual logout with cleanup
   */
  const forceLogout = useCallback(async (reason = 'Manual logout') => {
    dispatch(addNotification({
      type: 'info',
      title: 'Logged Out',
      message: reason,
    }))
    
    await handleUnauthorizedAccess(false)
  }, [dispatch, handleUnauthorizedAccess])

  return {
    handleUnauthorizedAccess,
    checkAndHandleUnauthorized,
    forceLogout,
  }
}

export default useUnauthorizedHandler
