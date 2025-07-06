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

### 4. Create Maps API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API key"
3. Restrict the key:
   - **Application restrictions**: HTTP referrers
   - **Website restrictions**: Add your domains:
     - `http://localhost:3000/*`
     - `https://yourdomain.com/*`
   - **API restrictions**: Select these APIs:
     - Maps JavaScript API
     - Places API

## 💳 **Google Pay & Apple Pay Setup**

### 🟢 **Google Pay Setup**

#### 1. Enable Google Pay in Stripe Dashboard
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Settings** > **Payment methods**
3. Find **Google Pay** and click **Enable**
4. Configure settings:
   - **Merchant name**: "Sathiko Pasal"
   - **Business type**: Select appropriate type
   - **Country**: Australia (matching your AUD currency)

#### 2. Verify Domain (Production Only)
1. In Stripe Dashboard, go to **Settings** > **Payment methods** > **Google Pay**
2. Add your production domain(s) to the domain verification list
3. Follow the verification process provided by Stripe

#### 3. Test Google Pay (Development)
- Google Pay will automatically work in development mode
- Test using Chrome browser on Android device or desktop
- Ensure you have a Google account with saved payment methods

### 🍎 **Apple Pay Setup**

#### 1. Apple Developer Account Setup
1. You need an **Apple Developer Account** ($99/year)
2. Go to [Apple Developer Portal](https://developer.apple.com/)
3. Sign in with your Apple ID and enroll in the developer program

#### 2. Create Merchant ID
1. In Apple Developer Portal, go to **Certificates, Identifiers & Profiles**
2. Click **Identifiers** > **+** (Add button)
3. Select **Merchant IDs** > **Continue**
4. Enter details:
   - **Description**: "Sathiko Pasal Merchant ID"
   - **Identifier**: `merchant.com.sathikopasal.payments` (must be unique)
5. Click **Continue** > **Register**

#### 3. Create Apple Pay Certificate
1. In Stripe Dashboard, go to **Settings** > **Payment methods** > **Apple Pay**
2. Click **Add new domain**
3. Enter your domain name (e.g., `sathikopasal.com`)
4. Download the domain verification file provided by Stripe
5. Upload this file to your website at `https://yourdomain.com/.well-known/apple-developer-merchantid-domain-association`

#### 4. Configure Apple Pay in Stripe
1. In Stripe Dashboard, go to **Settings** > **Payment methods** > **Apple Pay**
2. Click **Enable Apple Pay**
3. Enter your **Apple Merchant ID** created above
4. Upload the Apple Pay certificate (download from Apple Developer Portal)
5. Add your domains for verification

#### 5. Domain Verification
1. Ensure your website is accessible via HTTPS
2. Place the domain verification file at: `https://yourdomain.com/.well-known/apple-developer-merchantid-domain-association`
3. Verify the domain in both Apple Developer Portal and Stripe Dashboard

### 🔧 **Testing Payment Methods**

#### Google Pay Testing:
- **Desktop**: Chrome browser with Google account
- **Mobile**: Android device with Google Pay app
- **Requirements**: Saved payment methods in Google account

#### Apple Pay Testing:
- **Desktop**: Safari browser on macOS with Touch ID/Face ID
- **Mobile**: iOS device with Apple Pay set up
- **Requirements**: Saved cards in Apple Wallet

### 🎯 **Payment Method Display Logic**

The payment methods will automatically appear based on:

1. **Google Pay**: Shows when:
   - Chrome browser (desktop/mobile)
   - Android device with Google Pay
   - User has saved payment methods
   - Merchant domain is verified (production)

2. **Apple Pay**: Shows when:
   - Safari browser on macOS/iOS
   - Device supports Apple Pay (Touch ID/Face ID)
   - User has cards in Apple Wallet
   - Domain is verified with Apple

3. **Fallback**: Traditional card payment form always available

### 🔄 **Express Checkout Flow**

1. **User clicks Google Pay/Apple Pay button**
2. **Native payment sheet opens** (Google Pay/Apple Pay interface)
3. **User selects payment method** and confirms
4. **Payment processes** through Stripe
5. **Order creation** happens automatically
6. **Success redirect** to payment success page

### 📱 **Mobile Optimization**

The payment interface is optimized for mobile:
- Touch-friendly button sizes (48px height)
- Responsive design for all screen sizes
- Native payment sheet integration
- One-tap payment experience

## 🔍 **Environment Setup**

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

### Payment Testing:
1. Navigate to `/checkout` with items in cart
2. You should see Google Pay/Apple Pay buttons (if supported)
3. Traditional card form should always be available
4. Test payment flow end-to-end

## 🚨 **Security Notes**

- Never commit your `.env.local` file to version control
- Use strong, unique secrets for production
- Regularly rotate your Google OAuth credentials
- Restrict your API keys to specific domains and APIs
- Monitor your OAuth and Maps API usage in Google Cloud Console
- Monitor payment transactions in Stripe Dashboard
- Enable webhook endpoint monitoring
- Use HTTPS in production for Apple Pay requirement

## 🛠 **Production Deployment Checklist**

### Before Going Live:
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Verify Google OAuth redirect URIs include production domain
- [ ] Add production domain to Google Maps API restrictions
- [ ] Enable Google Pay in Stripe Dashboard
- [ ] Complete Apple Pay domain verification
- [ ] Test all payment methods on production domain
- [ ] Set up Stripe webhook endpoint
- [ ] Configure `STRIPE_WEBHOOK_SECRET` environment variable
- [ ] Test webhook functionality
- [ ] Enable Stripe live mode (when ready)

### Domain Verification Files:
- [ ] Apple Pay: `/.well-known/apple-developer-merchantid-domain-association`
- [ ] Google Pay: Domain added to Stripe Dashboard
- [ ] SSL Certificate: HTTPS enabled for Apple Pay requirement

## 📞 **Support Resources**

### Documentation:
- [Stripe Payment Element](https://stripe.com/docs/payments/payment-element)
- [Google Pay Web](https://developers.google.com/pay/api/web)
- [Apple Pay Web](https://developer.apple.com/apple-pay/web/)

### Common Issues:
- **Payment methods not showing**: Check browser compatibility and user setup
- **Apple Pay domain verification**: Ensure HTTPS and proper file placement
- **Google Pay merchant verification**: Complete Stripe Dashboard setup
- **Webhook signature verification**: Ensure `STRIPE_WEBHOOK_SECRET` is set correctly

## 🔍 **Debug Mode**

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
- Regularly rotate your Stripe webhook secret to complete the security implementation. 