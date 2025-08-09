# Railway Deployment Guide for Xpense Backend

This guide will walk you through deploying your Xpense Backend to Railway.

## 🚀 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Supabase Project**: Your database should be set up and running

## 📝 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Ensure all files are committed**:

   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Verify your `package.json` has the correct start script**:
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```

### Step 2: Create Railway Project

1. **Go to [railway.app](https://railway.app)** and sign in
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your `xpense-backend` repository**
5. **Click "Deploy Now"**

### Step 3: Configure Environment Variables

In your Railway project dashboard:

1. **Click on your service**
2. **Go to the "Variables" tab**
3. **Add the following environment variables**:

⚠️ **Important**: Change `JWT_SECRET` to a strong, unique secret key!

### Step 4: Update CORS Configuration

After deployment, you'll need to update your CORS configuration to include your Railway domain.

1. **Get your Railway domain** from the deployment dashboard
2. **Update `server.js`** (this will be done automatically with the railway.json config)

### Step 5: Test Your Deployment

1. **Wait for deployment to complete**
2. **Click on your service URL** (e.g., `https://your-app-name.up.railway.app`)
3. **Test the health endpoint**: `https://your-app-name.up.railway.app/api/health`

## 🔧 Environment Variables Explained

| Variable                    | Description                        | Example                   |
| --------------------------- | ---------------------------------- | ------------------------- |
| `SUPABASE_URL`              | Your Supabase project URL          | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY`         | Supabase anonymous key             | `eyJhbGciOi...`           |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key          | `eyJhbGciOi...`           |
| `JWT_SECRET`                | Secret key for JWT tokens          | `your-secret-key`         |
| `NODE_ENV`                  | Environment mode                   | `production`              |
| `PORT`                      | Port number (Railway auto-assigns) | `3000`                    |

## 🌐 Domain and SSL

Railway automatically provides:

- **Custom domain**: `https://your-app-name.up.railway.app`
- **SSL certificate**: HTTPS enabled by default
- **Auto-deployment**: Deploys on every git push

## 🔍 Testing Your Deployed API

### Health Check

```bash
curl https://your-app-name.up.railway.app/api/health
```

### Register User

```bash
curl -X POST https://your-app-name.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword123",
    "fullName": "Test User"
  }'
```

### Get Categories

```bash
curl -X GET https://your-app-name.up.railway.app/api/categories \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📊 Monitoring and Logs

### View Logs

1. Go to your Railway project dashboard
2. Click on your service
3. Go to the "Deployments" tab
4. Click on a deployment to view logs

### Monitor Performance

Railway provides built-in metrics for:

- CPU usage
- Memory usage
- Network traffic
- Response times

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot GET /"

**Solution**: Your API doesn't have a root route. Use `/api/health` instead.

### Issue 2: Database Connection Error

**Solutions**:

- Verify Supabase environment variables
- Check if your Supabase project is active
- Ensure database schema is applied

### Issue 3: CORS Errors

**Solutions**:

- Update CORS configuration in `server.js`
- Add your frontend domain to allowed origins

### Issue 4: Environment Variables Not Working

**Solutions**:

- Double-check variable names (case-sensitive)
- Restart the service after adding variables
- Verify values don't have extra spaces

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to your main branch:

```bash
# Make changes to your code
git add .
git commit -m "Update API functionality"
git push origin main
# Railway will automatically redeploy
```

## 💰 Railway Pricing

Railway offers:

- **Hobby Plan**: $5/month with generous limits
- **Pro Plan**: $20/month for production apps
- **Free Trial**: Available for testing

## 🔒 Security Best Practices

1. **Use strong JWT secret**:

   ```bash
   # Generate a secure secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Keep service role key secure**: Never expose in client-side code

3. **Enable RLS**: Ensure Row Level Security is enabled in Supabase

4. **Use HTTPS**: Railway provides this automatically

## 🚀 Next Steps After Deployment

1. **Update frontend**: Point your frontend to the new Railway URL
2. **Set up custom domain**: Add your own domain in Railway settings
3. **Monitor usage**: Check Railway dashboard regularly
4. **Set up alerts**: Configure notifications for downtime
5. **Backup strategy**: Supabase handles database backups

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: Community support
- **GitHub Issues**: For code-related issues

---

🎉 **Your Xpense Backend is now live on Railway!**

Your API will be available at: `https://your-app-name.up.railway.app`
