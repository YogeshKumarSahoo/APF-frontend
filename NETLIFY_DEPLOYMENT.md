# Netlify Deployment Guide

This guide covers deploying your React Router + Vite web app to Netlify with multiple deployment strategies.

## 🚀 Quick Deployment (Frontend Only)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Ensure your build works locally**
   ```bash
   npm run build:frontend
   ```

### Step 2: Deploy to Netlify

1. **Go to [Netlify](https://netlify.com)** and sign up/login
2. **Click "New site from Git"**
3. **Connect your Git provider** (GitHub, GitLab, etc.)
4. **Select your repository**
5. **Configure build settings:**
   - Build command: `npm run build:frontend`
   - Publish directory: `dist`
   - Node version: `20`

6. **Set environment variables** in Netlify dashboard:
   - Go to Site settings → Environment variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com`

7. **Deploy!** Click "Deploy site"

## 🔧 Backend Deployment Options

### Option A: Deploy Backend Separately (Recommended)

Deploy your backend to a separate service and connect it to your Netlify frontend:

**Backend Hosting Options:**
- **Railway**: Easy Node.js deployment
- **Render**: Free tier available
- **Heroku**: Classic choice
- **Vercel**: Serverless functions
- **AWS**: More complex but scalable

**Steps:**
1. Deploy backend to your chosen platform
2. Get the backend URL
3. Set `NEXT_PUBLIC_API_URL` in Netlify environment variables
4. Update your frontend API calls to use the backend URL

### Option B: Netlify Functions (Serverless)

Convert your backend to Netlify Functions:

1. **Create `netlify/functions/` directory**
2. **Move your API logic to serverless functions**
3. **Update frontend to call Netlify functions**

## 📁 Project Structure for Netlify

```
your-project/
├── src/                    # Frontend source
├── netlify.toml           # Netlify configuration
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
└── dist/                  # Built files (generated)
```

## ⚙️ Environment Variables

Set these in Netlify Dashboard → Site settings → Environment variables:

```env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# Backend Environment Variables (if using Netlify Functions)
GOOGLE_SHEETS_PRIVATE_KEY=your-private-key
GOOGLE_SHEETS_CLIENT_EMAIL=your-client-email
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
```

## 🔄 Continuous Deployment

Once connected to Git, Netlify will automatically:
- Deploy when you push to main branch
- Run your build command
- Update your live site

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Node.js version (use 20)
   - Verify all dependencies are in `package.json`
   - Check build logs in Netlify dashboard

2. **Routing Issues**
   - Ensure `netlify.toml` has redirect rules
   - Check that React Router is configured correctly

3. **API Calls Fail**
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Check CORS settings on your backend
   - Ensure backend is deployed and accessible

4. **Environment Variables Not Working**
   - Variables must start with `NEXT_PUBLIC_` for frontend
   - Redeploy after adding new environment variables

## 📊 Performance Optimization

1. **Enable Netlify's CDN** (automatic)
2. **Use Netlify's image optimization**
3. **Enable compression** (automatic)
4. **Set up proper caching headers**

## 🔒 Security Considerations

1. **Never commit sensitive data** to your repository
2. **Use environment variables** for API keys
3. **Enable HTTPS** (automatic on Netlify)
4. **Set up proper CORS** on your backend

## 📈 Monitoring

- **Netlify Analytics**: Built-in analytics
- **Deploy logs**: Available in Netlify dashboard
- **Function logs**: For serverless functions
- **Performance monitoring**: Built-in Core Web Vitals

## 🚀 Advanced Features

1. **Branch Deploys**: Deploy preview branches
2. **Form Handling**: Netlify Forms
3. **A/B Testing**: Split testing
4. **Edge Functions**: Global edge computing

## 📞 Support

- **Netlify Docs**: https://docs.netlify.com
- **Community**: https://community.netlify.com
- **Status Page**: https://netlifystatus.com
