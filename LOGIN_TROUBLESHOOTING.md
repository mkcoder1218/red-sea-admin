# Login Troubleshooting Guide

## ✅ **Fixed: Sign In Button Issue**

The sign-in button was not working due to a variable naming conflict in the API interceptor. This has been resolved.

### **What Was Fixed:**

1. **Variable Naming Conflict**: Fixed axios config parameter shadowing the imported config object
2. **Better Error Handling**: Added more specific error messages for different failure scenarios
3. **Connection Testing**: Added API connection test tool on the login page

### **How to Test the Fix:**

#### **Step 1: Test API Connection**
1. Go to the login page
2. Click the "Test Connection" tab
3. Click "Test Base URL" to verify your backend is accessible
4. Click "Test Login Endpoint" to verify the auth endpoint exists

#### **Step 2: Test Login Flow**
1. Go back to the "Login" tab
2. Enter credentials (use demo credentials button for testing)
3. Click "Sign In"
4. Should now work without the previous error

### **Common Issues and Solutions:**

#### **Issue 1: "Cannot connect to server"**
**Symptoms:** Error message about connection failure
**Solutions:**
- ✅ Ensure your backend server is running on `http://localhost:3000`
- ✅ Check if the backend URL in `.env` is correct
- ✅ Verify CORS is configured on your backend

#### **Issue 2: "Invalid email or password"**
**Symptoms:** 401 error response
**Solutions:**
- ✅ Verify credentials are correct
- ✅ Check backend user database
- ✅ Ensure backend auth endpoint is working

#### **Issue 3: CORS Errors**
**Symptoms:** Browser console shows CORS policy errors
**Solutions:**
- ✅ Configure CORS on your backend to allow `http://localhost:5173`
- ✅ Example for Express.js:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
```

#### **Issue 4: Backend Not Running**
**Symptoms:** Connection refused or network errors
**Solutions:**
- ✅ Start your backend server
- ✅ Verify it's running on the correct port (3000)
- ✅ Check backend logs for errors

### **Backend Requirements:**

Your backend must provide:

#### **1. Login Endpoint**
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Expected Response:
{
  "status": 200,
  "message": "Success",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": {
        "name": "User",
        "access_rules": ["read_cart", "write_cart"]
      }
    }
  }
}
```

#### **2. CORS Configuration**
```javascript
// Express.js example
const cors = require('cors')

app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',  // Your domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### **Testing Steps:**

#### **1. Backend Connection Test**
```bash
# Test if backend is running
curl http://localhost:3000

# Test login endpoint
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

#### **2. Frontend Connection Test**
1. Open browser developer tools (F12)
2. Go to Network tab
3. Try to login
4. Check for:
   - ✅ Request is sent to correct URL
   - ✅ No CORS errors
   - ✅ Response format matches expected structure

#### **3. Environment Configuration**
Create/update `.env` file:
```env
# Make sure this matches your backend URL
VITE_API_BASE_URL=http://localhost:3000

# Demo credentials (optional)
VITE_DEMO_EMAIL=mike1218@gmail.com
VITE_DEMO_PASSWORD=Hesoyam1218@
```

### **Debug Information:**

#### **Check Browser Console**
Look for these types of errors:
- ❌ CORS policy errors → Fix backend CORS
- ❌ Network errors → Check if backend is running
- ❌ 404 errors → Verify endpoint exists
- ❌ 500 errors → Check backend logs

#### **Check Network Tab**
Verify the request:
- ✅ URL: `http://localhost:3000/auth/login`
- ✅ Method: POST
- ✅ Headers: Content-Type: application/json
- ✅ Body: Contains email and password

#### **Check Response**
Expected response structure:
- ✅ Status: 200 (success) or 401 (invalid credentials)
- ✅ Body: Contains `data.token` and `data.user`
- ✅ User object has required fields

### **Quick Fix Checklist:**

- [ ] Backend server is running on port 3000
- [ ] CORS is configured to allow frontend domain
- [ ] `/auth/login` endpoint exists and accepts POST
- [ ] Response format matches expected structure
- [ ] No console errors in browser
- [ ] Network requests are reaching the backend

### **Still Having Issues?**

1. **Use the Connection Test**: Go to login page → "Test Connection" tab
2. **Check Browser Console**: Look for specific error messages
3. **Verify Backend**: Test endpoints with curl or Postman
4. **Check Network Tab**: Verify requests are being sent correctly

The login functionality should now work properly with better error handling and debugging tools!
