import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * AuthGuard component that handles initial route protection
 * Redirects authenticated users away from login page
 * Redirects unauthenticated users to login page
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const currentPath = location.pathname
    console.log('AuthGuard check:', { isAuthenticated, currentPath })

    // If user is authenticated and trying to access login page, redirect to dashboard
    if (isAuthenticated && currentPath === '/signin') {
      console.log('User already authenticated, redirecting to dashboard')
      navigate('/', { replace: true })
      return
    }

    // If user is not authenticated and trying to access protected routes, redirect to login
    if (!isAuthenticated && currentPath !== '/signin') {
      console.log('User not authenticated, redirecting to login')
      navigate('/signin', { replace: true })
      return
    }
  }, [isAuthenticated, location.pathname, navigate])

  return <>{children}</>
}

export default AuthGuard
