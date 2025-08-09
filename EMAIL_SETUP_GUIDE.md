# 📧 Email Receipt Setup Guide - Sathiko Pasal

This guide will help you set up beautiful email receipts for your **Sathiko Pasal** e-commerce store using Brevo (formerly Sendinblue).

## 🚀 Step 1: Install Required Packages

```bash
npm install @getbrevo/brevo
```

## 🔑 Step 2: Get Your Brevo API Key

1. **Sign up for Brevo** at [brevo.com](https://brevo.com) (formerly Sendinblue)
2. **Verify your email** and complete account setup
3. **Go to SMTP & API** → **API Keys** in the dashboard
4. **Create a new API key** for your project
5. **Copy the API key** - you'll need it for your `.env.local` file

## 🌐 Step 3: Configure Your Domain (Recommended)

For better email deliverability:

1. **Go to Senders & IP** in Brevo dashboard
2. **Add your domain** (e.g., `sathikokirana.com.au`)
3. **Update DNS records** as instructed:
   - Add SPF record
   - Add DKIM record  
   - Add DMARC record (optional but recommended)
4. **Wait for verification** (usually takes 15-30 minutes)

## ⚙️ Step 4: Environment Configuration

Add to your `.env.local` file:

```env
# Brevo Email Service
BREVO_API_KEY=xkeysib-your_actual_api_key_here
```

## 📧 Step 5: Update Email Domain in Code

Update the sender address in `utils/emailService.js`:

```javascript
// Change this line:
email: "orders@sathikokirana.com.au"

// To your verified domain:
email: "orders@yourdomain.com"
```

## 🎨 Step 6: Customize Email Template

The email template is in `utils/orderReceiptTemplate.js`. You can customize:

- **Colors and branding** by modifying the CSS styles
- **Logo image URL** - update the `src` attribute in the template
- **Contact information** and support email
- **Add special messages** for different seasons/promotions
- **Layout and sections** to match your brand

## 🧪 Step 7: Test Email Functionality

### Test with Guest Checkout:
1. Add items to cart (without logging in)
2. Go to checkout and fill in guest details
3. Complete payment with test card
4. Check email inbox for receipt

### Test with Logged-in User:
1. Login to your account
2. Add items to cart
3. Complete checkout
4. Check email inbox for receipt

### Test Email Addresses:
For testing, you can use:
- Your personal email
- Temporary email services like [temp-mail.org](https://temp-mail.org)
- Test email addresses from your domain

## 📋 Features Included

✅ **Beautiful HTML emails** with responsive design  
✅ **Order details** with product images and pricing  
✅ **Customer information** (guest vs registered)  
✅ **Delivery address** formatting  
✅ **Order summary** with subtotal, shipping, and total  
✅ **Branding** with Sathiko Pasal colors and messaging  
✅ **Support contact** information  
✅ **Mobile-friendly** design  
✅ **Plain text fallback** for better compatibility  

## 🔧 Troubleshooting

### Email Not Sending?
1. **Check API key** in `.env.local`
2. **Verify domain** in Brevo dashboard
3. **Check server logs** for error messages
4. **Ensure imports** are correct in `emailService.js`
5. **Check Brevo dashboard** for delivery reports

### Email in Spam Folder?
1. **Set up SPF/DKIM** records properly
2. **Use verified domain** as sender
3. **Avoid spam trigger words** in subject/content
4. **Start with low volume** to build reputation
5. **Use Brevo's reputation** (they have good deliverability)

### API Errors?
1. **Check API key format** - should start with `xkeysib-`
2. **Verify account status** in Brevo dashboard
3. **Check rate limits** (free tier: 300 emails/day)
4. **Ensure sender email** is verified in Brevo

### Template Issues?
1. **Test HTML** in different email clients
2. **Use inline CSS** for better compatibility
3. **Keep images** hosted on reliable CDN
4. **Test on mobile** email clients

## 💰 Brevo Pricing

- **Free tier**: 300 emails/day (perfect to start!)
- **Starter**: €20/month for 20,000 emails
- **Business**: €65/month for 100,000 emails
- **Enterprise**: Custom pricing

The free tier is more generous than most competitors!

## 🆚 Why Brevo over Resend?

**Advantages:**
- ✅ **More generous free tier** (300 vs 100 emails/day)
- ✅ **Established reputation** for deliverability
- ✅ **Comprehensive dashboard** with analytics
- ✅ **Template builder** included
- ✅ **SMS capabilities** (bonus feature)
- ✅ **Better for international** businesses

**Considerations:**
- 📧 **HTML templates** instead of React components
- 🔧 **Slightly more setup** for advanced features

## 🛡️ Security Notes

- **Never expose** your Brevo API key in client-side code
- **Use environment variables** for all sensitive data
- **The API key** should only be used in server-side code (API routes)
- **Keep backups** of your environment variables
- **Monitor usage** in Brevo dashboard

## 📞 Support

If you have issues:
1. **Check Brevo docs**: [developers.brevo.com](https://developers.brevo.com)
2. **Brevo support**: Available via chat and email
3. **Review server logs** for specific error messages
4. **Test with simple text email** first, then upgrade to HTML

## 🎉 You're Done!

Your **Sathiko Pasal** customers will now receive beautiful email receipts for every order! Brevo's reliable infrastructure ensures excellent delivery rates and provides detailed analytics.

### Next Steps:
- Monitor email delivery rates in Brevo dashboard
- Set up email templates in Brevo's visual editor (optional)
- Consider adding SMS notifications for order updates
- Track email engagement metrics
- Explore Brevo's marketing automation features

### Advanced Features to Explore:
- **Email sequences** for customer onboarding
- **A/B testing** for email templates  
- **Contact segmentation** for targeted marketing
- **Integration with CRM** systems
- **Automated workflows** for different order statuses

Happy selling! 🛒 