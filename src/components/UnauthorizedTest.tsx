import React from 'react'
import { useAppSelector } from '@/store/hooks'
import { useUnauthorizedHandler } from '@/hooks/useUnauthorizedHandler'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, AlertTriangle, LogOut, TestTube } from 'lucide-react'

const UnauthorizedTest: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { handleUnauthorizedAccess, forceLogout } = useUnauthorizedHandler()

  // Simulate an unauthorized API call
  const simulateUnauthorizedCall = async () => {
    try {
      // Make a request that will return 401
      await api.get('/protected-endpoint-that-returns-401')
    } catch (error) {
      console.log('Unauthorized error caught by interceptor:', error)
    }
  }

  // Simulate unauthorized by manually calling the handler
  const simulateUnauthorizedManual = () => {
    handleUnauthorizedAccess(true)
  }

  // Test force logout
  const testForceLogout = () => {
    forceLogout('Testing force logout functionality')
  }

  // Simulate token expiration by removing token but keeping user state
  const simulateTokenExpiration = () => {
    localStorage.removeItem('authToken')
    // Next API call will fail with 401
    simulateUnauthorizedCall()
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Unauthorized Handling Test
          </CardTitle>
          <CardDescription>
            You need to be logged in to test unauthorized handling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please log in first to test the unauthorized handling functionality.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Unauthorized Handling Test
        </CardTitle>
        <CardDescription>
          Test automatic logout when receiving 401 unauthorized responses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Auth Status */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
            Currently Authenticated
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300">
            User: {user?.first_name} {user?.last_name} ({user?.email})
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Role: {user?.role?.name}
          </p>
        </div>

        {/* Test Buttons */}
        <div className="space-y-3">
          <h4 className="font-medium">Test Scenarios:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={simulateUnauthorizedCall}
              variant="outline"
              className="flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              Simulate 401 API Call
            </Button>

            <Button
              onClick={simulateTokenExpiration}
              variant="outline"
              className="flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Simulate Token Expiration
            </Button>

            <Button
              onClick={simulateUnauthorizedManual}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Manual Unauthorized
            </Button>

            <Button
              onClick={testForceLogout}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Force Logout
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>What happens when you click these buttons:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• <strong>Simulate 401 API Call:</strong> Makes a request that returns 401, triggering automatic logout</li>
              <li>• <strong>Simulate Token Expiration:</strong> Removes token and makes API call, simulating expired session</li>
              <li>• <strong>Manual Unauthorized:</strong> Directly triggers the unauthorized handler</li>
              <li>• <strong>Force Logout:</strong> Manually logs out with custom message</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Expected Behavior */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            Expected Behavior
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>✅ User state cleared from Redux</li>
            <li>✅ Auth token removed from localStorage</li>
            <li>✅ Persisted auth state cleared</li>
            <li>✅ Notification shown (session expired)</li>
            <li>✅ Automatic redirect to login page</li>
            <li>✅ Axios auth header cleared</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default UnauthorizedTest
