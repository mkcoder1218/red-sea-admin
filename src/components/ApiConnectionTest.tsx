import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Wifi, WifiOff, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { config } from '@/lib/config'

const ApiConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [responseData, setResponseData] = useState<any>(null)

  const testConnection = async () => {
    setConnectionStatus('testing')
    setErrorMessage('')
    setResponseData(null)

    try {
      // Test basic connection to the API base URL
      const response = await fetch(config.api.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.text()
        setResponseData({ status: response.status, data })
        setConnectionStatus('success')
      } else {
        setErrorMessage(`HTTP ${response.status}: ${response.statusText}`)
        setConnectionStatus('error')
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Connection failed')
      setConnectionStatus('error')
    }
  }

  const testLoginEndpoint = async () => {
    setConnectionStatus('testing')
    setErrorMessage('')
    setResponseData(null)

    try {
      // Test the login endpoint with invalid credentials to see if it responds
      const response = await fetch(`${config.api.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'invalid'
        })
      })

      const data = await response.json()
      setResponseData({ status: response.status, data })
      
      // Even if login fails, if we get a response, the endpoint is working
      if (response.status === 401 || response.status === 400) {
        setConnectionStatus('success') // Endpoint is responding
      } else if (response.ok) {
        setConnectionStatus('success')
      } else {
        setConnectionStatus('error')
        setErrorMessage(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Login endpoint test failed')
      setConnectionStatus('error')
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Wifi className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'testing':
        return <Badge variant="secondary">Testing...</Badge>
      case 'success':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>
      case 'error':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Not Tested</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          API Connection Test
        </CardTitle>
        <CardDescription>
          Test connection to your backend API at {config.api.baseUrl}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <p className="font-medium">Connection Status</p>
            <p className="text-sm text-muted-foreground">Backend API: {config.api.baseUrl}</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={testConnection}
            disabled={connectionStatus === 'testing'}
            variant="outline"
            className="flex items-center gap-2"
          >
            {connectionStatus === 'testing' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wifi className="w-4 h-4" />
            )}
            Test Base URL
          </Button>

          <Button
            onClick={testLoginEndpoint}
            disabled={connectionStatus === 'testing'}
            variant="outline"
            className="flex items-center gap-2"
          >
            {connectionStatus === 'testing' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            Test Login Endpoint
          </Button>
        </div>

        {/* Error Display */}
        {connectionStatus === 'error' && errorMessage && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Connection Error:</strong> {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {connectionStatus === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Connection Successful!</strong> Your backend API is responding.
            </AlertDescription>
          </Alert>
        )}

        {/* Response Data */}
        {responseData && (
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Response Data:</h4>
            <div className="text-sm">
              <p><strong>Status:</strong> {responseData.status}</p>
              <pre className="mt-2 p-2 bg-background rounded text-xs overflow-auto max-h-32">
                {typeof responseData.data === 'string' 
                  ? responseData.data 
                  : JSON.stringify(responseData.data, null, 2)
                }
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Troubleshooting:</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Make sure your backend server is running on {config.api.baseUrl}</li>
            <li>• Check that CORS is configured to allow requests from this domain</li>
            <li>• Verify the /auth/login endpoint exists and accepts POST requests</li>
            <li>• Check browser console for additional error details</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default ApiConnectionTest
