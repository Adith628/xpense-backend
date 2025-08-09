# CORS Troubleshooting Guide

## 🚨 CORS Error Resolution

If you're getting CORS errors when accessing your deployed Railway backend from your local frontend, follow these steps:

## ✅ Quick Fix Applied

The CORS configuration has been updated to **always allow localhost origins**, even in production. This allows you to develop your frontend locally while using the deployed backend.

### What Changed:
- ✅ Added support for all common localhost ports
- ✅ Added regex patterns to match any localhost port
- ✅ Added CORS debugging logs
- ✅ Removed environment-based restrictions for localhost

## 🔄 Deploy the Fix

1. **Commit and push the changes**:
   ```bash
   git add .
   git commit -m "Fix CORS for local development"
   git push origin main
   ```

2. **Railway will auto-deploy** (wait ~30 seconds)

3. **Test the fix**:
   ```bash
   curl -X POST https://your-app.up.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -H "Origin: http://localhost:3000" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

## 🧪 Testing Your Frontend

### In your frontend, make sure you're using the correct URL:

```javascript
// Replace with your actual Railway URL
const API_BASE_URL = 'https://your-app-name.up.railway.app';

// Example login request
const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for CORS with credentials
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

## 🔍 Enable CORS Debugging

To see detailed CORS logs in Railway:

1. **Add environment variable in Railway**:
   ```
   CORS_DEBUG=true
   ```

2. **Check Railway logs** to see CORS requests:
   - Go to Railway Dashboard
   - Click your service
   - Go to "Deployments" tab
   - View logs for CORS debug info

## 🌐 Common Frontend Frameworks Setup

### React/Vite
```javascript
// In your API client
const API_URL = 'https://your-app.up.railway.app';

// Axios configuration
import axios from 'axios';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});
```

### Next.js
```javascript
// In your API routes or client
const API_URL = 'https://your-app.up.railway.app';

// Fetch with credentials
const response = await fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(loginData)
});
```

### Vue.js
```javascript
// In your Vue service
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-app.up.railway.app',
  withCredentials: true
});
```

## 📋 Allowed Origins (After Fix)

Your backend now accepts requests from:

### ✅ Always Allowed (Development)
- `http://localhost:*` (any port)
- `http://127.0.0.1:*` (any port)
- Common ports: 3000, 3001, 5173, 5174, 4173, 8080

### ✅ Production Domains
- Your Railway app: `https://*.railway.app`
- Custom domains you add

### ✅ No Origin (Mobile/cURL)
- Requests without Origin header (mobile apps, cURL, Postman)

## 🛠️ Still Getting CORS Errors?

### 1. Check Your Frontend Request
Make sure you're including:
```javascript
{
  method: 'POST',
  credentials: 'include',  // ← This is important
  headers: {
    'Content-Type': 'application/json'
  }
}
```

### 2. Verify Railway URL
Double-check your Railway app URL:
- Go to Railway Dashboard
- Copy the exact URL (usually ends with `.up.railway.app`)

### 3. Check Browser Network Tab
- Open Developer Tools → Network
- Look for the OPTIONS preflight request
- Check if it's returning 200 OK

### 4. Test with cURL First
```bash
# Replace with your Railway URL
curl -X OPTIONS https://your-app.up.railway.app/api/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

## 🔧 Advanced CORS Configuration

If you need to restrict origins later (for security), update the `allowedOrigins` array in `server.js`:

```javascript
const allowedOrigins = [
  'https://your-production-domain.com',
  'https://your-staging-domain.com',
  'http://localhost:3000', // Keep for development
  // Add your specific domains
];
```

## 📞 Still Need Help?

1. **Check Railway logs** for CORS debug messages
2. **Enable CORS_DEBUG=true** in Railway environment variables
3. **Test the health endpoint** first: `https://your-app.up.railway.app/api/health`
4. **Verify your frontend is making requests to the correct URL**

The fix should work immediately after Railway redeploys! 🚀
