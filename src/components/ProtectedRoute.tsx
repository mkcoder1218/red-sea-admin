import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { useUnauthorizedHandler } from '@/hooks/useUnauthorizedHandler'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  requiredPermissions?: string[]
  fallbackPath?: string
}

/**
 * ProtectedRoute component that guards routes based on authentication and authorization
 * Automatically redirects unauthorized users to login page
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermissions = [],
  fallbackPath = '/signin'
}) => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { handleUnauthorizedAccess } = useUnauthorizedHandler()

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      console.warn('User not authenticated, redirecting to login')
      navigate(fallbackPath, { replace: true })
      return
    }

    // Check role requirement
    if (requiredRole && user.role?.name !== requiredRole) {
      console.warn(`User role '${user.role?.name}' does not match required role '${requiredRole}'`)
      handleUnauthorizedAccess(true)
      return
    }

    // Check permission requirements
    if (requiredPermissions.length > 0) {
      const userPermissions = user.role?.access_rules || []
      const hasAllPermissions = requiredPermissions.every(permission => 
        userPermissions.includes(permission)
      )

      if (!hasAllPermissions) {
        const missingPermissions = requiredPermissions.filter(permission => 
          !userPermissions.includes(permission)
        )
        console.warn('User missing required permissions:', missingPermissions)
        handleUnauthorizedAccess(true)
        return
      }
    }
  }, [isAuthenticated, user, requiredRole, requiredPermissions, navigate, fallbackPath, handleUnauthorizedAccess])

  // Don't render children if not authenticated
  if (!isAuthenticated || !user) {
    return null
  }

  // Check role requirement (render-time check)
  if (requiredRole && user.role?.name !== requiredRole) {
    return null
  }

  // Check permission requirements (render-time check)
  if (requiredPermissions.length > 0) {
    const userPermissions = user.role?.access_rules || []
    const hasAllPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    )

    if (!hasAllPermissions) {
      return null
    }
  }

  return <>{children}</>
}

export default ProtectedRoute
