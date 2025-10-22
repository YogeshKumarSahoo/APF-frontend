# Environment Variables for Netlify Deployment

## Frontend Environment Variables (NEXT_PUBLIC_*)

These variables are exposed to the browser and should be set in Netlify Dashboard → Site settings → Environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## Backend Environment Variables (if using Netlify Functions)

If you choose to convert your backend to Netlify Functions, set these in Netlify Dashboard:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id

# App Configuration
NODE_ENV=production
PORT=8888
```

## Setting Environment Variables in Netlify

### Method 1: Netlify Dashboard (Recommended)

1. Go to your site in Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add variable**
4. Enter variable name and value
5. Click **Save**

### Method 2: netlify.toml (Not Recommended for Secrets)

```toml
[build.environment]
  NEXT_PUBLIC_API_URL = "https://your-backend-url.com"
  NODE_VERSION = "20"
```

⚠️ **Warning**: Don't put sensitive data in `netlify.toml` as it's committed to your repository.

## Environment Variable Best Practices

1. **Prefix frontend variables** with `NEXT_PUBLIC_`
2. **Never commit secrets** to your repository
3. **Use different values** for different environments (staging, production)
4. **Document all required variables** in your README
5. **Test locally** with the same environment variables

## Local Development Setup

Create a `.env.local` file for local development:

```env
# Local Development Environment
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

## Production Checklist

- [ ] All required environment variables are set in Netlify
- [ ] Backend is deployed and accessible
- [ ] CORS is configured on backend
- [ ] HTTPS is enabled (automatic on Netlify)
- [ ] Google Sheets API credentials are valid
- [ ] Spreadsheet is shared with service account
