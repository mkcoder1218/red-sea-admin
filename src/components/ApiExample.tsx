import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice'
import { AuthService, UserService, ProductService } from '@/services'
import { useApi, useApiMutation } from '@/hooks/useApi'
import { config } from '@/lib/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

const ApiExample: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { loading } = useAppSelector((state) => state.ui)
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  // API hooks for different operations
  const {
    data: users,
    loading: usersLoading,
    execute: fetchUsers
  } = useApi(UserService.getUsers, {
    loadingKey: 'fetchUsers',
    showErrorNotification: true
  })

  const {
    data: products,
    loading: productsLoading,
    execute: fetchProducts
  } = useApi(ProductService.getProducts, {
    loadingKey: 'fetchProducts',
    showErrorNotification: true
  })

  const {
    loading: loginLoading,
    execute: performLogin
  } = useApiMutation(AuthService.login, {
    loadingKey: 'login',
    showSuccessNotification: true,
    successMessage: 'Login successful!'
  })

  const {
    loading: logoutLoading,
    execute: performLogout
  } = useApiMutation(AuthService.logout, {
    loadingKey: 'logout',
    showSuccessNotification: true,
    successMessage: 'Logged out successfully!'
  })

  // Handle login with Redux integration
  const handleLogin = async () => {
    try {
      dispatch(loginStart())

      const response = await performLogin(loginForm)

      if (response && response.data) {
        dispatch(loginSuccess(response.data.user))
      }
    } catch (error) {
      dispatch(loginFailure('Login failed'))
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await performLogout()
    // AuthService.logout already clears the token
  }

  // Handle fetch users
  const handleFetchUsers = async () => {
    await fetchUsers({ page: 1, limit: 10 })
  }

  // Handle fetch products
  const handleFetchProducts = async () => {
    await fetchProducts({ page: 1, limit: 10 })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Integration Example</CardTitle>
          <CardDescription>
            Demonstration of Axios instance with Redux integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Authentication Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Authentication</h3>
            
            {!isAuthenticated ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleLogin}
                    disabled={loginLoading || loading.login || !loginForm.email || !loginForm.password}
                    className="flex-1"
                  >
                    {(loginLoading || loading.login) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLoginForm({
                      email: config.demo.email,
                      password: config.demo.password
                    })}
                    disabled={loginLoading || loading.login}
                    className="text-xs"
                  >
                    Use Demo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-green-800 dark:text-green-200">
                    Logged in as: <strong>{user?.first_name} {user?.last_name}</strong> ({user?.email})
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Role: {user?.role?.name} | Status: {user?.status} | Verified: {user?.is_verified ? 'Yes' : 'No'}
                  </p>
                </div>
                
                <Button 
                  onClick={handleLogout} 
                  disabled={logoutLoading || loading.logout}
                  variant="outline"
                >
                  {(logoutLoading || loading.logout) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* API Calls Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">API Calls</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleFetchUsers} 
                disabled={usersLoading || loading.fetchUsers}
                variant="outline"
              >
                {(usersLoading || loading.fetchUsers) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Fetch Users
              </Button>
              
              <Button 
                onClick={handleFetchProducts} 
                disabled={productsLoading || loading.fetchProducts}
                variant="outline"
              >
                {(productsLoading || loading.fetchProducts) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Fetch Products
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">API Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Users Results */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Users ({users?.total || 0})</h4>
                {users?.users ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {users.users.slice(0, 3).map((user) => (
                      <div key={user.id} className="text-sm">
                        <strong>{user.name}</strong> - {user.email}
                      </div>
                    ))}
                    {users.users.length > 3 && (
                      <div className="text-sm text-muted-foreground">
                        ... and {users.users.length - 3} more
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No users loaded</p>
                )}
              </div>

              {/* Products Results */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Products ({products?.total || 0})</h4>
                {products?.products ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {products.products.slice(0, 3).map((product) => (
                      <div key={product.id} className="text-sm">
                        <strong>{product.name}</strong> - ${product.price}
                      </div>
                    ))}
                    {products.products.length > 3 && (
                      <div className="text-sm text-muted-foreground">
                        ... and {products.products.length - 3} more
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No products loaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Loading States */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Global Loading States</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>Login: {loading.login ? '✅' : '❌'}</div>
              <div>Logout: {loading.logout ? '✅' : '❌'}</div>
              <div>Users: {loading.fetchUsers ? '✅' : '❌'}</div>
              <div>Products: {loading.fetchProducts ? '✅' : '❌'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApiExample
