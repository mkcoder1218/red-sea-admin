# Red sea  Dashboard - Setup Guide

This guide will help you set up and configure the Red sea  Dashboard with your backend API.

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd market-admin-dashboard-bloom

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# API Configuration - CHANGE THIS TO YOUR BACKEND URL
VITE_API_BASE_URL=http://localhost:3000

# App Configuration
VITE_APP_NAME=Red sea 
VITE_APP_VERSION=1.0.0

# Demo Account (optional - for testing)
VITE_DEMO_EMAIL=your-test-email@example.com
VITE_DEMO_PASSWORD=your-test-password
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Backend API Configuration

### Required Endpoints

Your backend API should provide the following endpoints:

#### Authentication Endpoint
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "+1234567890",
      "status": "Active",
      "type": "User",
      "is_verified": true,
      "role": {
        "id": "role-id",
        "name": "Admin",
        "description": "Administrator role",
        "type": "Admin",
        "access_rules": ["read_users", "write_users", "delete_users"]
      }
    }
  }
}
```

#### Optional Endpoints
```
POST /auth/logout          # Logout endpoint
GET /auth/profile          # Get current user profile
POST /auth/refresh         # Refresh token
GET /users                 # List users
GET /products              # List products
```

### CORS Configuration

Make sure your backend allows requests from your frontend domain:

```javascript
// Example for Express.js
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
```

## 🔐 Authentication Flow

### 1. Login Process
1. User enters credentials on `/signin` page
2. Frontend sends POST request to `/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token and user data
5. User is redirected to dashboard

### 2. Token Management
- JWT token is automatically stored in localStorage
- Token is included in all API requests via Authorization header
- Token is persisted across browser sessions
- Automatic logout on 401 responses

### 3. Session Persistence
- User authentication state persists across page reloads
- Theme and UI preferences are saved
- Notifications and loading states are not persisted

## 🎯 Using the Application

### Login Options

1. **Manual Login**: Enter your own credentials
2. **Demo Account**: Click "Use demo credentials" to fill the form with test data

### Dashboard Features

The dashboard includes several example sections:

1. **Redux Example**: Demonstrates state management
2. **API Example**: Shows real API integration
3. **Persistence Example**: Tests state persistence
4. **Unauthorized Test**: Tests automatic logout on 401 responses

### Testing Authentication

1. **Login Test**: Use the login form with valid credentials
2. **Persistence Test**: Login, refresh page, verify you stay logged in
3. **Logout Test**: Use logout buttons to test cleanup
4. **Unauthorized Test**: Use the test buttons to simulate 401 responses

## 🛠️ Customization

### Changing API Base URL

Update the `.env` file:
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### Customizing Demo Credentials

Update the `.env` file:
```env
VITE_DEMO_EMAIL=your-demo-email@example.com
VITE_DEMO_PASSWORD=your-demo-password
```

### Adding New API Endpoints

1. Create service functions in `src/services/`
2. Use the existing patterns for error handling
3. Leverage the `useApi` hook for React integration

Example:
```typescript
// src/services/customService.ts
export class CustomService {
  static async getCustomData(): Promise<CustomData[]> {
    try {
      return await apiMethods.get<CustomData[]>('/custom-endpoint')
    } catch (error) {
      throw handleApiError(error)
    }
  }
}

// In your component
const { data, loading, execute } = useApi(CustomService.getCustomData)
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your backend allows requests from the frontend domain
   - Check browser console for specific CORS error messages

2. **Login Not Working**
   - Verify backend is running on the configured URL
   - Check network tab for API response format
   - Ensure response matches expected structure

3. **401 Unauthorized Errors**
   - Check if token is being sent in requests
   - Verify token format and expiration
   - Use the "Unauthorized Test" section to test automatic logout

4. **State Not Persisting**
   - Check browser localStorage for persisted data
   - Verify Redux DevTools for state changes
   - Use "Persistence Example" section for testing

### Debug Tools

1. **Redux DevTools**: Install browser extension for state inspection
2. **Network Tab**: Monitor API requests and responses
3. **Console Logs**: Check for error messages and warnings
4. **localStorage**: Inspect stored tokens and persisted state

### Getting Help

1. Check the browser console for error messages
2. Use the test components on the dashboard
3. Verify your backend API matches the expected format
4. Check the network tab for failed requests

## 📚 Additional Resources

- **Redux Toolkit**: https://redux-toolkit.js.org/
- **React Router**: https://reactrouter.com/
- **Axios**: https://axios-http.com/
- **Tailwind CSS**: https://tailwindcss.com/

## 🔄 Development Workflow

1. **Start Backend**: Ensure your API server is running
2. **Start Frontend**: Run `npm run dev`
3. **Test Login**: Use demo credentials or your own
4. **Develop Features**: Add new components and API integrations
5. **Test Thoroughly**: Use the provided test components

The application is now ready for development and can be easily configured to work with any backend API that follows the expected authentication format!
