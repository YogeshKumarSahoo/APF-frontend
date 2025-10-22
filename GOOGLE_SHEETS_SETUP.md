# Google Sheets API Setup Guide

This guide will help you set up Google Sheets API integration for the branch location capture app.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "Branch Location App")
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create a Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Enter a service account name (e.g., "branch-location-service")
4. Add a description (optional)
5. Click "Create and Continue"
6. Skip the "Grant access" step for now
7. Click "Done"

## Step 4: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" → "Create new key"
5. Select "JSON" format
6. Click "Create"
7. The JSON file will download automatically

## Step 5: Extract Credentials from JSON

Open the downloaded JSON file and extract these values:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

## Step 6: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new blank spreadsheet
3. Name it "Branch Locations" (or any name you prefer)
4. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

## Step 7: Share the Sheet with Service Account

1. In your Google Sheet, click "Share" (top right)
2. Add the service account email (from Step 4)
3. Give it "Editor" permissions
4. Click "Send"

## Step 8: Set Environment Variables

Create a `.env` file in your project root with:

```env
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
GOOGLE_SPREADSHEET_ID="your-spreadsheet-id-from-step-6"
```

**Important Notes:**
- Keep the `\n` characters in the private key - they are required
- The private key should be wrapped in quotes
- Never commit the `.env` file to version control

## Step 9: Test the Integration

1. Start your development server: `npm run dev`
2. Try submitting a branch location through the app
3. Check your Google Sheet - you should see the data appear

## Troubleshooting

### Common Issues:

1. **"Credentials not configured" error**
   - Check that all environment variables are set correctly
   - Ensure the private key includes the `\n` characters

2. **"Permission denied" error**
   - Make sure you shared the Google Sheet with the service account email
   - Verify the service account has "Editor" permissions

3. **"Spreadsheet not found" error**
   - Double-check the spreadsheet ID in your environment variables
   - Ensure the spreadsheet exists and is accessible

4. **"API not enabled" error**
   - Go back to Google Cloud Console and ensure Google Sheets API is enabled

### Getting Help:

- Check the [Google Sheets API documentation](https://developers.google.com/sheets/api)
- Verify your service account permissions in Google Cloud Console
- Test your credentials using the [Google Sheets API Explorer](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get)

## Security Notes

- Never expose your service account credentials in client-side code
- Keep your `.env` file secure and never commit it to version control
- Consider using environment-specific service accounts for production
- Regularly rotate your service account keys for security
