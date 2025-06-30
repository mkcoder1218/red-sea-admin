import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { AuthService } from '@/services'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import PersistLoader from './PersistLoader'

/**
 * AuthenticatedLayout component that wraps protected routes
 * Redirects to login if user is not authenticated
 */
const AuthenticatedLayout: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const handleLogout = async () => {
    try {
      await AuthService.logout()
      dispatch(logout())
      navigate('/signin', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API call fails
      dispatch(logout())
      navigate('/signin', { replace: true })
    }
  }

  // Debug logging
  console.log('AuthenticatedLayout render:', { isAuthenticated, user: user ? 'exists' : 'null' })

  // Show loading while user data is not available
  if (!user) {
    console.log('No user data, showing loader')
    return <PersistLoader />
  }

  console.log('Rendering AuthenticatedLayout with user:', user)

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="border-b border-border p-4 glass-effect">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 hover:bg-accent rounded-lg transition-colors" />
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-foreground">Red sea </h1>
                <p className="text-sm text-muted-foreground">Manage your B2C Red sea </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Welcome, {user.first_name} {user.last_name}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6 overflow-auto bg-background">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AuthenticatedLayout
