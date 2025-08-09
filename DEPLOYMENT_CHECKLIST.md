# Railway Deployment Checklist

## ✅ Pre-Deployment Checklist

### Code Preparation

- [ ] All code committed and pushed to GitHub
- [ ] `package.json` has correct `start` script: `"start": "node server.js"`
- [ ] Environment variables are not hardcoded in code
- [ ] CORS configuration supports production domains
- [ ] Error handling is implemented
- [ ] Logging is configured

### Database Setup

- [ ] Supabase project is created and active
- [ ] Database schema is applied (`database/schema.sql`)
- [ ] RLS policies are enabled
- [ ] Default categories are inserted
- [ ] Connection credentials are available

### Environment Variables Ready

- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `JWT_SECRET` (generate a strong one!)
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`

## 🚀 Deployment Steps

### 1. Create Railway Project

- [ ] Sign up/login to [railway.app](https://railway.app)
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository
- [ ] Click "Deploy Now"

### 2. Configure Environment Variables

- [ ] Go to project → Variables tab
- [ ] Add all environment variables from checklist above
- [ ] **Generate strong JWT_SECRET**:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Save variables

### 3. Wait for Deployment

- [ ] Monitor build logs
- [ ] Wait for "Deployed" status
- [ ] Note your Railway app URL

## 🧪 Post-Deployment Testing

### Basic Health Check

- [ ] Visit: `https://your-app.up.railway.app/api/health`
- [ ] Should return: `{"message": "Server is running", ...}`

### Authentication Flow

- [ ] Test user registration:

  ```bash
  curl -X POST https://your-app.up.railway.app/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'
  ```

- [ ] Test user login:

  ```bash
  curl -X POST https://your-app.up.railway.app/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}'
  ```

- [ ] Save access token from response

### Protected Routes

- [ ] Test profile endpoint:
  ```bash
  curl -X GET https://your-app.up.railway.app/api/protected/profile \
    -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
  ```

### Categories and Transactions

- [ ] Test get categories:

  ```bash
  curl -X GET https://your-app.up.railway.app/api/categories \
    -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
  ```

- [ ] Test create transaction:
  ```bash
  curl -X POST https://your-app.up.railway.app/api/transactions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
    -d '{"title":"Test Expense","amount":25.50,"category":"Food & Dining","transaction_type":"expense"}'
  ```

## 🔧 Configuration Updates

### Update Frontend Configuration

- [ ] Update API base URL in frontend to: `https://your-app.up.railway.app`
- [ ] Test CORS is working from frontend
- [ ] Verify all API calls work

### Custom Domain (Optional)

- [ ] Purchase domain if needed
- [ ] Add custom domain in Railway settings
- [ ] Update DNS records
- [ ] Update CORS configuration to include custom domain

## 🔍 Monitoring & Maintenance

### Set Up Monitoring

- [ ] Check Railway dashboard metrics
- [ ] Monitor error logs in Railway console
- [ ] Set up alerts if available
- [ ] Test all endpoints periodically

### Database Monitoring

- [ ] Monitor Supabase dashboard
- [ ] Check database usage
- [ ] Monitor RLS policies are working
- [ ] Backup verification

## 🚨 Troubleshooting Common Issues

### Build Failures

- [ ] Check Node.js version compatibility
- [ ] Verify all dependencies are in package.json
- [ ] Check for syntax errors in code
- [ ] Review build logs for specific errors

### Runtime Errors

- [ ] Check environment variables are set correctly
- [ ] Verify database connection
- [ ] Check Supabase project is active
- [ ] Review application logs

### CORS Issues

- [ ] Verify origin URLs in CORS configuration
- [ ] Check if credentials are needed
- [ ] Test with different frontend URLs
- [ ] Ensure preflight requests work

### Database Connection Issues

- [ ] Verify Supabase URL format
- [ ] Check API keys are correct
- [ ] Ensure RLS policies allow access
- [ ] Test database connection locally first

## 📝 Success Criteria

Your deployment is successful when:

- [ ] Health check endpoint returns 200
- [ ] User registration works
- [ ] User login returns valid token
- [ ] Protected routes work with token
- [ ] Categories can be fetched
- [ ] Transactions can be created
- [ ] Statistics endpoints work
- [ ] No CORS errors from frontend
- [ ] All tests pass against production URL

## 🎉 Deployment Complete!

Once all items are checked:

- [ ] Document your production URL
- [ ] Share API documentation with frontend team
- [ ] Set up monitoring/alerts
- [ ] Plan for scaling if needed

**Your Xpense Backend is now live at**: `https://your-app-name.up.railway.app`

## 📞 Getting Help

If you encounter issues:

- Check Railway documentation: [docs.railway.app](https://docs.railway.app)
- Review error logs in Railway dashboard
- Test locally first to isolate issues
- Join Railway Discord for community support
