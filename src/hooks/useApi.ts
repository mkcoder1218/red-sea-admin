import { useState, useCallback, useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { addNotification, setLoading } from '@/store/slices/uiSlice'
import { handleApiError, type ApiError } from '@/lib/api'
import { useUnauthorizedHandler } from './useUnauthorizedHandler'

interface UseApiOptions {
  showSuccessNotification?: boolean
  showErrorNotification?: boolean
  loadingKey?: string
  successMessage?: string
}

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  execute: (...args: any[]) => Promise<T | null>
  reset: () => void
}

/**
 * Custom hook for making API calls with Redux integration
 * Automatically handles loading states, error handling, and notifications
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const {
    showSuccessNotification = false,
    showErrorNotification = true,
    loadingKey,
    successMessage = 'Operation completed successfully',
  } = options

  const dispatch = useAppDispatch()
  const { checkAndHandleUnauthorized } = useUnauthorizedHandler()

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        // Set loading state
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        // Set loading in Redux store if loadingKey is provided
        if (loadingKey) {
          dispatch(setLoading({ key: loadingKey, loading: true }))
        }

        // Execute the API function
        const result = await apiFunction(...args)
        
        // Update state with result
        setState(prev => ({ ...prev, data: result, loading: false }))
        
        // Show success notification if enabled
        if (showSuccessNotification) {
          dispatch(addNotification({
            type: 'success',
            title: 'Success',
            message: successMessage,
          }))
        }
        
        return result
      } catch (error) {
        // Check if it's an unauthorized error first
        const wasUnauthorized = checkAndHandleUnauthorized(error)

        if (!wasUnauthorized) {
          // Handle other errors normally
          const apiError = handleApiError(error)
          setState(prev => ({ ...prev, error: apiError, loading: false }))

          // Show error notification if enabled
          if (showErrorNotification) {
            dispatch(addNotification({
              type: 'error',
              title: 'Error',
              message: apiError.message,
            }))
          }
        }

        return null
      } finally {
        // Clear loading state in Redux store
        if (loadingKey) {
          dispatch(setLoading({ key: loadingKey, loading: false }))
        }
      }
    },
    [apiFunction, dispatch, loadingKey, showSuccessNotification, showErrorNotification, successMessage]
  )

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  }
}

/**
 * Hook for API calls that automatically execute on mount
 */
export function useApiQuery<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  args: any[] = [],
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const api = useApi(apiFunction, options)

  // Execute on mount
  useEffect(() => {
    api.execute(...args)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return api
}

/**
 * Hook for mutations (POST, PUT, DELETE operations)
 */
export function useApiMutation<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const defaultOptions: UseApiOptions = {
    showSuccessNotification: true,
    showErrorNotification: true,
    ...options,
  }

  return useApi(apiFunction, defaultOptions)
}

export default useApi
