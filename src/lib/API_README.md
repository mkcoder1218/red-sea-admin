# API Integration Setup

This project includes a comprehensive API integration setup using Axios with TypeScript support, Redux integration, and custom hooks for seamless API calls.

## Structure

```
src/
├── lib/
│   └── api.ts              # Axios instance configuration
├── services/
│   ├── index.ts            # Service exports
│   ├── authService.ts      # Authentication API calls
│   ├── userService.ts      # User management API calls
│   └── productService.ts   # Product management API calls
├── hooks/
│   └── useApi.ts           # Custom hooks for API calls
└── components/
    └── ApiExample.tsx      # Example component
```

## Configuration

### Base URL
The API base URL is configured to `http://localhost:3000` in `src/lib/api.ts`.

### Authentication
- Automatic token injection from localStorage
- Token management utilities (`setAuthToken`, `clearAuthToken`)
- Automatic logout on 401 responses

### Request/Response Interceptors
- Automatic authorization header injection
- Request/response logging in development
- Error handling and user feedback

## Usage

### Basic API Calls

```typescript
import { AuthService, UserService, ProductService } from '@/services'

// Login
const loginResponse = await AuthService.login({
  email: 'user@example.com',
  password: 'password'
})

// Get users with pagination
const users = await UserService.getUsers({
  page: 1,
  limit: 10,
  search: 'john'
})

// Get products
const products = await ProductService.getProducts({
  category: 'electronics',
  inStock: true
})
```

### Using Custom Hooks

```typescript
import { useApi, useApiMutation } from '@/hooks/useApi'
import { UserService } from '@/services'

// For data fetching
const {
  data: users,
  loading,
  error,
  execute: fetchUsers
} = useApi(UserService.getUsers, {
  loadingKey: 'fetchUsers',
  showErrorNotification: true
})

// For mutations (POST, PUT, DELETE)
const {
  loading: createLoading,
  execute: createUser
} = useApiMutation(UserService.createUser, {
  showSuccessNotification: true,
  successMessage: 'User created successfully!'
})

// Execute the API call
const handleFetchUsers = () => {
  fetchUsers({ page: 1, limit: 10 })
}

const handleCreateUser = () => {
  createUser({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  })
}
```

### Redux Integration

The API hooks automatically integrate with Redux for:
- Global loading states
- Error notifications
- Success notifications

```typescript
import { useAppSelector } from '@/store/hooks'

const { loading } = useAppSelector((state) => state.ui)

// Check specific loading states
const isUserLoading = loading.fetchUsers
const isLoginLoading = loading.login
```

## Available Services

### AuthService
- `login(credentials)` - User login
- `register(userData)` - User registration
- `logout()` - User logout
- `refreshToken(token)` - Refresh auth token
- `getProfile()` - Get current user profile
- `updateProfile(data)` - Update user profile
- `changePassword(data)` - Change password
- `forgotPassword(email)` - Request password reset
- `resetPassword(data)` - Reset password

### UserService
- `getUsers(params)` - Get users with pagination/filters
- `getUserById(id)` - Get user by ID
- `createUser(data)` - Create new user
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Delete user
- `toggleUserStatus(id, status)` - Activate/deactivate user
- `getUserStats()` - Get user statistics
- `searchUsers(query)` - Search users
- `exportUsers(params)` - Export users to CSV

### ProductService
- `getProducts(params)` - Get products with pagination/filters
- `getProductById(id)` - Get product by ID
- `createProduct(data)` - Create new product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product
- `toggleProductStatus(id, status)` - Activate/deactivate product
- `updateStock(id, stock)` - Update product stock
- `getProductStats()` - Get product statistics
- `getCategories()` - Get all categories
- `getBrands()` - Get all brands
- `uploadProductImage(id, file)` - Upload product image

## Error Handling

### Automatic Error Handling
- Network errors are automatically caught
- HTTP error responses are parsed
- User-friendly error messages are displayed
- Errors are logged in development

### Custom Error Handling
```typescript
import { handleApiError } from '@/lib/api'

try {
  const result = await AuthService.login(credentials)
} catch (error) {
  const apiError = handleApiError(error)
  console.error('Login failed:', apiError.message)
}
```

## Environment Configuration

### Development
- Request/response logging enabled
- Detailed error information
- Redux DevTools integration

### Production
- Logging disabled
- Optimized error messages
- Performance optimizations

## Backend API Expectations

The frontend expects the backend API to follow these conventions:

### Authentication Endpoints
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token
- `GET /auth/profile` - Get profile
- `PUT /auth/profile` - Update profile

### User Endpoints
- `GET /users` - List users
- `POST /users` - Create user
- `GET /users/:id` - Get user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Product Endpoints
- `GET /products` - List products
- `POST /products` - Create product
- `GET /products/:id` - Get product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Response Format
```json
{
  "data": {},
  "message": "Success message",
  "success": true,
  "status": 200
}
```

### Error Format
```json
{
  "message": "Error message",
  "status": 400,
  "errors": {
    "field": ["Validation error"]
  }
}
```

## Best Practices

1. **Use Services**: Always use service classes instead of direct API calls
2. **Use Hooks**: Prefer `useApi` and `useApiMutation` hooks for component integration
3. **Error Handling**: Let the hooks handle errors automatically, add custom handling only when needed
4. **Loading States**: Use the global loading states from Redux for consistent UX
5. **Type Safety**: All API calls are fully typed with TypeScript
6. **Token Management**: Use `setAuthToken` and `clearAuthToken` utilities

## Example Component

See `src/components/ApiExample.tsx` for a complete example of how to use the API integration in a React component.
