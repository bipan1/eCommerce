# Google OAuth & Maps API Setup Guide

## 🔧 **Environment Variables Required**

Create a `.env.local` file in your project root with these variables:

```env
# Database
DATABASE_URL=""

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (for NextAuth)
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# Google Maps API (for Address Autocomplete)
NEXT_PUBLIC_GOOGLE_MAP_API_KEY="your-google-maps-api-key-here"

# AWS Configuration
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="your-aws-region"
AWS_S3_BUCKET="your-s3-bucket-name"

# Stripe Configuration
STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

## 🚀 **Google Cloud Console Setup**

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the required APIs:
   - **Google+ API** (for OAuth)
   - **Maps JavaScript API** (for address autocomplete)
   - **Places API** (for address search)

### 2. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name: "Your App Name"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email)

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret

### 4. Create Google Maps API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API Key and restrict it (recommended):
   - Click on the key name to edit
   - Under "Application restrictions", choose "HTTP referrers"
   - Add your domains:
     - `localhost:3000/*` (for development)
     - `localhost:3001/*` (alternative development port)
     - `yourdomain.com/*` (for production)
   - Under "API restrictions", select "Restrict key"
   - Choose these APIs:
     - Maps JavaScript API
     - Places API
4. Save the API Key as `NEXT_PUBLIC_GOOGLE_MAP_API_KEY`

## 🗺️ **Google Maps API Configuration**

### Required APIs to Enable:
1. **Maps JavaScript API** - For loading the maps
2. **Places API** - For address autocomplete and search

### API Key Setup:
1. Create an API key in Google Cloud Console
2. Restrict the key to your domains for security
3. Enable billing (required for Places API)
4. Set usage quotas if needed

### Testing Maps API:
1. Open your account page
2. Try typing in the address field
3. You should see autocomplete suggestions
4. Check browser console for any error messages

## 🔄 **Callback URL Configuration**

### Development (localhost:3000)
```
http://localhost:3000/api/auth/callback/google
```

### Production (your domain)
```
https://yourdomain.com/api/auth/callback/google
```

## 🛠️ **Troubleshooting Common Issues**

### 1. "Invalid redirect_uri" Error
- Ensure the redirect URI in Google Console matches exactly
- Check for trailing slashes or protocol mismatches
- Verify the domain is correct

### 2. "Access blocked" Error
- Add your email as a test user in OAuth consent screen
- Ensure the app is not in "Testing" mode for production
- Check if the required APIs are enabled

### 3. Google Maps API Issues
- **"Google Maps API key is missing"**: Set `NEXT_PUBLIC_GOOGLE_MAP_API_KEY` in `.env.local`
- **"RefererNotAllowedMapError"**: Add your domain to API key restrictions
- **"ApiNotActivatedMapError"**: Enable Maps JavaScript API and Places API
- **"RequestDenied"**: Check API key restrictions and quotas
- **Billing not enabled**: Enable billing in Google Cloud Console

### 4. Address Autocomplete Not Working
- Check if Places API is enabled
- Verify API key has Places API access
- Check browser console for JavaScript errors
- Ensure you have billing enabled (Places API requires it)

### 5. Database Connection Issues
- Verify your DATABASE_URL is correct
- Ensure your RDS instance is accessible
- Check if the database user has proper permissions

### 6. NextAuth Secret Issues
- Generate a strong secret: `openssl rand -base64 32`
- Ensure NEXTAUTH_SECRET is set in environment variables
- Verify NEXTAUTH_URL matches your domain

## 🔍 **Testing the Setup**

### OAuth Testing:
1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Click "Continue with Google"
4. You should be redirected to Google's consent screen
5. After authorization, you should be redirected back to your app

### Maps API Testing:
1. Navigate to `/account` (must be logged in)
2. Try typing in the "Street Address" field
3. You should see autocomplete suggestions
4. Select an address and verify it populates other fields

## 📝 **Debug Mode**

Enable debug mode by setting in your `.env.local`:
```env
NODE_ENV=development
```

This will show detailed logs in the console for troubleshooting.

## 🚨 **Security Notes**

- Never commit your `.env.local` file to version control
- Use strong, unique secrets for production
- Regularly rotate your Google OAuth credentials
- Restrict your API keys to specific domains and APIs
- Monitor your OAuth and Maps API usage in Google Cloud Console
- Enable billing alerts to avoid unexpected charges

## 💰 **Billing Information**

### Google Maps API Pricing:
- **Maps JavaScript API**: $7 per 1,000 requests (first 28,500 free monthly)
- **Places API**: $17 per 1,000 requests (first 2,500 free monthly)
- **Free tier**: $200 credit monthly for first-time users

### Monitoring Usage:
1. Go to Google Cloud Console > "APIs & Services" > "Quotas"
2. Set up billing alerts
3. Monitor usage regularly 