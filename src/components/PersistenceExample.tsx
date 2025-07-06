import React from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { setTheme, toggleSidebar, addNotification } from '@/store/slices/uiSlice'
import { 
  flushPersist, 
  purgePersist, 
  clearPersistedAuth, 
  resetAppState,
  checkPersistenceHealth 
} from '@/store/persistUtils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Database, Trash2, RefreshCw, LogOut, Settings } from 'lucide-react'

const PersistenceExample: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { theme, sidebarOpen } = useAppSelector((state) => state.ui)

  const handleFlushPersist = async () => {
    try {
      await flushPersist()
      dispatch(addNotification({
        type: 'success',
        title: 'Persistence Flushed',
        message: 'All pending changes have been saved to localStorage'
      }))
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Flush Failed',
        message: 'Failed to flush persistence'
      }))
    }
  }

  const handlePurgePersist = async () => {
    try {
      await purgePersist()
      dispatch(addNotification({
        type: 'warning',
        title: 'Persistence Purged',
        message: 'All persisted state has been cleared'
      }))
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Purge Failed',
        message: 'Failed to purge persistence'
      }))
    }
  }

  const handleClearAuth = async () => {
    try {
      await clearPersistedAuth()
      dispatch(logout())
      dispatch(addNotification({
        type: 'info',
        title: 'Auth Cleared',
        message: 'Authentication state has been cleared'
      }))
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Clear Failed',
        message: 'Failed to clear auth state'
      }))
    }
  }

  const handleResetApp = async () => {
    if (window.confirm('This will reset the entire app and reload the page. Continue?')) {
      await resetAppState()
    }
  }

  const handleCheckHealth = () => {
    const health = checkPersistenceHealth()
    dispatch(addNotification({
      type: 'info',
      title: 'Persistence Health',
      message: `Bootstrapped: ${health.isBootstrapped}, Rehydrated: ${health.isRehydrated}`
    }))
  }

  const handleThemeChange = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    dispatch(setTheme(nextTheme))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Redux Persistence Example
        </CardTitle>
        <CardDescription>
          Demonstration of Redux Persist features and state management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current State Display */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Persisted State</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                Auth State
                <Badge variant={isAuthenticated ? "default" : "secondary"}>
                  {isAuthenticated ? "Authenticated" : "Not Authenticated"}
                </Badge>
              </h4>
              <div className="text-sm space-y-1">
                <p>User: {user ? `${user.first_name} ${user.last_name} (${user.email})` : 'None'}</p>
                <p>Role: {user?.role?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">UI Preferences (Persisted)</h4>
              <div className="text-sm space-y-1">
                <p>Theme: <Badge variant="outline">{theme}</Badge></p>
                <p>Sidebar: <Badge variant="outline">{sidebarOpen ? 'Open' : 'Closed'}</Badge></p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Persistence Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Persistence Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button 
              onClick={handleFlushPersist}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              Flush Persist
            </Button>

            <Button 
              onClick={handleCheckHealth}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Check Health
            </Button>

            <Button 
              onClick={handleThemeChange}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Change Theme
            </Button>

            <Button 
              onClick={() => dispatch(toggleSidebar())}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Toggle Sidebar
            </Button>

            <Button 
              onClick={handleClearAuth}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Clear Auth
            </Button>

            <Button 
              onClick={handlePurgePersist}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Purge All
            </Button>
          </div>

          <Button 
            onClick={handleResetApp}
            variant="destructive"
            className="w-full flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Entire App
          </Button>
        </div>

        <Separator />

        {/* Instructions */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Test Persistence</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>1. Change theme or toggle sidebar to see UI preferences persist</p>
            <p>2. Login to see auth state persist across page reloads</p>
            <p>3. Use "Flush Persist" to manually save current state</p>
            <p>4. Use "Check Health" to verify persistence status</p>
            <p>5. Use "Clear Auth" to remove only authentication data</p>
            <p>6. Use "Purge All" to clear all persisted state</p>
            <p>7. Refresh the page to see state restoration in action</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PersistenceExample
