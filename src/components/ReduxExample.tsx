import React from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateUser 
} from '@/store/slices/authSlice'
import { 
  toggleSidebar, 
  addNotification, 
  setTheme,
  openModal,
  closeModal 
} from '@/store/slices/uiSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const ReduxExample: React.FC = () => {
  const dispatch = useAppDispatch()
  
  // Using useAppSelector to get state from different slices
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth)
  const { sidebarOpen, theme, notifications } = useAppSelector((state) => state.ui)

  // Example functions to demonstrate Redux actions
  const handleLogin = () => {
    dispatch(loginStart())
    
    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: '9425856d-af9c-48f8-bf2a-54d2682c9c0e',
        social_login: null,
        social_login_id: null,
        email: 'mike1218@gmail.com',
        verification_code: '4d50ed1b-7f02-4861-9c03-a70e7590bcad',
        verification_time: '2025-06-06T20:41:40.795Z',
        recovery_request_time: null,
        recovery_time: null,
        phone_number: '+251962886951',
        first_name: 'Mikel',
        last_name: 'Arteta',
        status: 'Active',
        type: 'User',
        pref_language: 'EN',
        pref_currency: 'USD',
        pref_unit: 'm',
        is_verified: false,
        createdAt: '2025-06-06T20:41:40.823Z',
        updatedAt: '2025-06-06T20:41:40.823Z',
        deletedAt: null,
        role_id: 'a9966a8c-8294-4240-8470-9c2038797e0e',
        role: {
          id: 'a9966a8c-8294-4240-8470-9c2038797e0e',
          name: 'User',
          description: 'Regular user role',
          type: 'User',
          access_rules: ['read_cart', 'write_cart', 'delete_cart'],
          createdAt: '2025-06-06T18:52:56.538Z',
          updatedAt: '2025-06-09T07:46:28.697Z',
          deletedAt: null
        }
      }
      dispatch(loginSuccess(mockUser))
      dispatch(addNotification({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back!'
      }))
    }, 1000)
  }

  const handleLoginError = () => {
    dispatch(loginStart())
    
    setTimeout(() => {
      dispatch(loginFailure('Invalid credentials'))
      dispatch(addNotification({
        type: 'error',
        title: 'Login Failed',
        message: 'Please check your credentials'
      }))
    }, 1000)
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(addNotification({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been logged out successfully'
    }))
  }

  const handleUpdateUser = () => {
    if (user) {
      dispatch(updateUser({ first_name: 'Updated', last_name: 'User' }))
      dispatch(addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated'
      }))
    }
  }

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    dispatch(setTheme(newTheme))
    dispatch(addNotification({
      type: 'info',
      title: 'Theme Changed',
      message: `Theme changed to ${newTheme}`
    }))
  }

  const handleOpenModal = () => {
    dispatch(openModal('example-modal'))
  }

  const handleCloseModal = () => {
    dispatch(closeModal('example-modal'))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Redux Store Example</CardTitle>
          <CardDescription>
            Demonstration of useAppSelector and useAppDispatch hooks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auth State Display */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Auth State:</h3>
            <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>User: {user ? `${user.first_name} ${user.last_name} (${user.email})` : 'None'}</p>
            <p>Role: {user?.role?.name || 'N/A'}</p>
            <p>Status: {user?.status || 'N/A'}</p>
            <p>Verified: {user?.is_verified ? 'Yes' : 'No'}</p>
            <p>Error: {error || 'None'}</p>
          </div>

          {/* UI State Display */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">UI State:</h3>
            <p>Sidebar Open: {sidebarOpen ? 'Yes' : 'No'}</p>
            <p>Theme: {theme}</p>
            <p>Notifications: {notifications.length}</p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button 
              onClick={handleLogin} 
              disabled={isLoading}
              variant="default"
            >
              {isLoading ? 'Logging in...' : 'Login (Success)'}
            </Button>
            
            <Button 
              onClick={handleLoginError} 
              disabled={isLoading}
              variant="destructive"
            >
              Login (Error)
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
            >
              Logout
            </Button>
            
            <Button 
              onClick={handleUpdateUser}
              disabled={!user}
              variant="secondary"
            >
              Update User
            </Button>
            
            <Button 
              onClick={handleToggleSidebar}
              variant="outline"
            >
              Toggle Sidebar
            </Button>
            
            <Button 
              onClick={handleThemeChange}
              variant="outline"
            >
              Change Theme
            </Button>
          </div>

          {/* Recent Notifications */}
          {notifications.length > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Recent Notifications:</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {notifications.slice(0, 3).map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-2 rounded text-sm ${
                      notification.type === 'success' ? 'bg-green-100 text-green-800' :
                      notification.type === 'error' ? 'bg-red-100 text-red-800' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <strong>{notification.title}</strong>: {notification.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ReduxExample
