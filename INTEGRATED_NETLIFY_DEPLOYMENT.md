# Integrated Netlify Deployment Guide

This guide covers deploying your React Router + Vite frontend AND Node.js backend together on Netlify using Netlify Functions.

## 🚀 What's Been Set Up

✅ **Netlify Functions Created:**
- `netlify/functions/health.js` - Health check endpoint
- `netlify/functions/branches.js` - Branch data API endpoint

✅ **Configuration Updated:**
- `netlify.toml` - Configured for Functions deployment
- `src/app/page.jsx` - Updated API calls to use relative URLs
- `vite.config.ts` - Optimized for production builds

✅ **API Routing:**
- `/api/health` → `/.netlify/functions/health`
- `/api/branches` → `/.netlify/functions/branches`

## 🎯 Deployment Steps

### Step 1: Push Your Code

```bash
git add .
git commit -m "Add Netlify Functions for integrated deployment"
git push origin main
```

### Step 2: Deploy to Netlify

1. **Go to [Netlify](https://netlify.com)** and sign up/login
2. **Click "New site from Git"**
3. **Connect your Git provider** (GitHub, GitLab, etc.)
4. **Select your repository**
5. **Configure build settings:**
   - Build command: `npm run build:frontend`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
   - Node version: `20`

6. **Deploy!** Click "Deploy site"

### Step 3: Test Your Deployment

Once deployed, test these endpoints:

- **Frontend**: `https://your-site-name.netlify.app`
- **Health Check**: `https://your-site-name.netlify.app/api/health`
- **Branch API**: `https://your-site-name.netlify.app/api/branches` (POST)

## 🔧 How It Works

### Frontend + Backend Integration

1. **Frontend** builds to `dist/` directory
2. **Backend** runs as Netlify Functions in `netlify/functions/`
3. **API calls** are routed through Netlify's redirect system
4. **Everything** runs on the same domain (no CORS issues!)

### API Flow

```
Frontend Request: /api/branches
       ↓
Netlify Redirect: /.netlify/functions/branches
       ↓
Function Execution: branches.js
       ↓
Google Sheets API: Updates spreadsheet
       ↓
Response: JSON data back to frontend
```

## 📊 Benefits of This Setup

✅ **Single Deployment** - Frontend and backend deploy together
✅ **No CORS Issues** - Same domain for everything
✅ **Automatic Scaling** - Netlify Functions scale automatically
✅ **Global CDN** - Fast worldwide performance
✅ **HTTPS Included** - SSL certificates handled automatically
✅ **Git Integration** - Automatic deployments on push

## 🛠️ Local Development

For local development with Netlify Functions:

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Start local development**:
   ```bash
   netlify dev
   ```

This will run both your frontend and functions locally at `http://localhost:8888`

## 🔍 Monitoring & Debugging

### Netlify Dashboard
- **Deploy logs**: Check build status
- **Function logs**: Monitor API calls
- **Analytics**: Track usage

### Function Logs
- Go to Netlify Dashboard → Functions
- Click on function name to see logs
- Monitor errors and performance

## 🚨 Troubleshooting

### Common Issues:

1. **Function Timeout**
   - Netlify Functions have a 10-second timeout
   - Optimize Google Sheets API calls
   - Consider caching for large operations

2. **Build Failures**
   - Check Node.js version (use 20)
   - Verify all dependencies are installed
   - Check function syntax

3. **API Not Working**
   - Verify redirects in `netlify.toml`
   - Check function logs
   - Test endpoints individually

4. **Google Sheets Errors**
   - Verify service account credentials
   - Check spreadsheet permissions
   - Monitor API quotas

## 📈 Performance Optimization

1. **Function Optimization**:
   - Keep functions lightweight
   - Use connection pooling for external APIs
   - Implement proper error handling

2. **Frontend Optimization**:
   - Code splitting (already configured)
   - Image optimization
   - Caching strategies

## 🔒 Security

✅ **Environment Variables**: Sensitive data in Netlify dashboard
✅ **HTTPS**: Automatic SSL certificates
✅ **CORS**: Handled by same-origin requests
✅ **Input Validation**: Implemented in functions

## 📞 Support

- **Netlify Docs**: https://docs.netlify.com/functions/
- **Function Examples**: https://functions.netlify.com/
- **Community**: https://community.netlify.com

## 🎉 You're All Set!

Your app now runs entirely on Netlify with:
- Frontend served from CDN
- Backend running as serverless functions
- Automatic deployments from Git
- Global performance optimization

No separate backend hosting needed! 🚀
