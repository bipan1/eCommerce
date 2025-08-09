const SibApiV3Sdk = require('@getbrevo/brevo');

// Test script to verify Brevo email functionality
async function testBrevoEmail() {
  try {
    // Check if API key is configured
    if (!process.env.BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY not found in environment variables');
      process.exit(1);
    }

    console.log('🔑 API Key found, testing Brevo connection...');

    // Initialize Brevo API client
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

    // Test email data
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { 
      name: "Sathiko Pasal", 
      email: "info@sathikokirana.com.au" // Replace with your verified domain
    };
    sendSmtpEmail.to = [{ 
      email: "bipan13345@gmail.com", // Replace with your test email
      name: "Test Customer" 
    }];
    sendSmtpEmail.subject = "Test Email - Sathiko Pasal Order System";
    sendSmtpEmail.htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🎉 Test Email from Sathiko Pasal</h2>
          <p>This is a test email to verify your Brevo integration is working correctly.</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>✅ If you receive this email, your Brevo setup is working!</strong></p>
            <p>Your order receipt emails will be sent successfully.</p>
          </div>
          <p>Best regards,<br>The Sathiko Pasal Team</p>
        </body>
      </html>
    `;
    sendSmtpEmail.textContent = `
Test Email from Sathiko Pasal

This is a test email to verify your Brevo integration is working correctly.

✅ If you receive this email, your Brevo setup is working!
Your order receipt emails will be sent successfully.

Best regards,
The Sathiko Pasal Team
    `;

    // Send test email
    console.log('📧 Sending test email...');
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ Test email sent successfully!');
    console.log('📨 Message ID:', response.messageId);
    console.log('🎯 Check your inbox for the test email');
    
  } catch (error) {
    console.error('❌ Error sending test email:');
    console.error(error.response?.body || error.message);
    
    if (error.response?.body?.code === 'unauthorized') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check your BREVO_API_KEY in .env.local');
      console.log('   - Ensure API key starts with "xkeysib-"');
      console.log('   - Verify your Brevo account is active');
    }
    
    if (error.response?.body?.code === 'invalid_parameter') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check sender email is verified in Brevo');
      console.log('   - Update sender email in this test script');
      console.log('   - Verify domain is authenticated in Brevo');
    }
  }
}

// Run the test
testBrevoEmail(); 