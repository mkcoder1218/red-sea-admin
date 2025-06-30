import React, { useEffect, useState } from 'react'
import { useAuthRestore } from '@/hooks/useAuthRestore'
import { useAppDispatch } from '@/store/hooks'
import { addNotification } from '@/store/slices/uiSlice'

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * AuthProvider component that handles authentication restoration
 * and token synchronization when the app loads
 */
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthRestore()
  const dispatch = useAppDispatch()
  const [hasShownWelcome, setHasShownWelcome] = useState(false)

  useEffect(() => {
    // Show welcome back message only once when user is restored from persistence
    // and only if they're accessing a protected route (not login page)
    if (isAuthenticated && user && !hasShownWelcome && window.location.pathname !== '/signin') {
      dispatch(addNotification({
        type: 'info',
        title: 'Welcome back!',
        message: `Logged in as ${user.first_name} ${user.last_name}`,
      }))
      setHasShownWelcome(true)
    }
  }, [isAuthenticated, user, dispatch, hasShownWelcome])

  return <>{children}</>
}

export default AuthProvider
