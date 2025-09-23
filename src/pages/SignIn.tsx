
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice'
import { AuthService } from '@/services'
import { config } from '@/lib/config'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, Package, Loader2, AlertCircle } from "lucide-react"
import ApiConnectionTest from '@/components/ApiConnectionTest'

const SignIn = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [isResendingVerification, setIsResendingVerification] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (error) setLocalError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields')
      return
    }

    try {
      dispatch(loginStart())

      const response = await AuthService.login({
        email: formData.email,
        password: formData.password
      })

      if (response.data && response.data.user) {
        dispatch(loginSuccess(response.data.user))
        navigate('/')
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      let errorMessage = 'Login failed. Please try again.'

      if (error.message?.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Please check if your backend is running.'
      } else if (error.response?.status === 401) {
        // Check for specific error messages from the API
        const apiErrors = error.response?.data?.error?.errors
        if (apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0) {
          errorMessage = apiErrors[0] // Use the first error message
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else {
          errorMessage = 'Invalid email or password.'
        }
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (error.message) {
        errorMessage = error.message
      }

      dispatch(loginFailure(errorMessage))
      setLocalError(errorMessage)
    }
  }

  const handleResendVerification = async () => {
    if (!formData.email) {
      setLocalError('Please enter your email address first')
      return
    }

    try {
      setIsResendingVerification(true)
      setLocalError('')
      
      await AuthService.resendVerification()
      setLocalError('Verification email sent! Please check your inbox.')
    } catch (error: any) {
      console.error('Resend verification error:', error)
      setLocalError('Failed to send verification email. Please try again.')
    } finally {
      setIsResendingVerification(false)
    }
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <img src="/public/logo.png" alt="Red Sea Market" className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Red Sea Market</h1>
          <p className="text-muted-foreground">Sign in to your admin panel</p>
        </div>

        {/* Sign In Form */}
        <Card className="card-simple shadow-lg">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="test">Test Connection</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your dashboard
                </CardDescription>
              </CardHeader>
          <CardContent className="space-y-4">
            {displayError && (
              <Alert variant={displayError.includes('Verification email sent') ? 'default' : 'destructive'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex flex-col space-y-2">
                  <span>{displayError}</span>
                  {displayError.includes('Email not yet verified') && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResendVerification}
                      disabled={isResendingVerification || isLoading}
                      className="w-fit"
                    >
                      {isResendingVerification ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Resend Verification Email'
                      )}
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-background/50"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-background/50"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                size="lg"
                disabled={isLoading || !formData.email || !formData.password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials Info */}
            <div className="text-center text-sm space-y-2">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-primary font-medium mb-1">Demo Account</p>
                <p className="text-xs text-muted-foreground">
                  Email: {config.demo.email}<br />
                  Password: {config.demo.password}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({
                  email: config.demo.email,
                  password: config.demo.password
                })}
                className="text-primary hover:text-primary/80 text-xs underline"
                disabled={isLoading}
              >
                Use demo credentials
              </button>
            </div>
          </CardContent>
            </TabsContent>

            <TabsContent value="test">
              <div className="p-6">
                <ApiConnectionTest />
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2024 Red Sea Market. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
