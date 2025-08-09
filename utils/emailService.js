const SibApiV3Sdk = require('@getbrevo/brevo');
import { getOrderReceiptEmailHTML } from './orderReceiptTemplate'

// Initialize Brevo API client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

export const sendOrderReceiptEmail = async ({
  customerEmail,
  customerName,
  orderNumber,
  orderData,
  isGuest = false
}) => {
  try {
    // Generate order number if not provided
    const orderNum = orderNumber || `#SP-${Date.now()}`;

    // Calculate totals with free shipping for orders over $100
    const subtotal = orderData.products.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0
    );
    const shipping = subtotal > 100 ? 0.00 : 8.00;
    const total = subtotal + shipping;

    // Format order date
    const orderDate = new Date().toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create HTML content for the email
    const htmlContent = getOrderReceiptEmailHTML({
      customerName,
      customerEmail,
      orderNumber: orderNum,
      orderDate,
      items: orderData.products,
      subtotal,
      shipping,
      total,
      deliveryAddress: orderData.address,
      isGuest
    });

    // Create email data for Brevo
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: "Sathiko Pasal",
      email: "orders@sathikokirana.com.au" // Replace with your verified domain
    };
    sendSmtpEmail.to = [{ email: customerEmail, name: customerName }];
    sendSmtpEmail.subject = `Order Confirmation ${orderNum} - Sathiko Pasal`;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.textContent = `
      Dear ${customerName},

      Thank you for your order with Sathiko Pasal!

      Order Number: ${orderNum}
      Total Amount: $${total.toFixed(2)}
      Order Date: ${orderDate}

      Your fresh Nepali groceries are being prepared and will be delivered soon.

      Questions? Contact us at support@sathikokirana.com.au

      Thank you for choosing Sathiko Pasal!
      Melbourne's premier Nepali grocery store.

      Best regards,
      The Sathiko Pasal Team
    `;

    // Send email using Brevo
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log('Order receipt email sent successfully:', response.messageId);
    return { success: true, emailId: response.messageId };

  } catch (error) {
    console.error('Failed to send order receipt email:', error);
    return { success: false, error: error.message };
  }
};

// Alternative function for plain text emails (fallback)
export const sendSimpleOrderEmail = async ({
  customerEmail,
  customerName,
  orderNumber,
  total
}) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: "Sathiko Pasal",
      email: "orders@sathikokirana.com.au"
    };
    sendSmtpEmail.to = [{ email: customerEmail, name: customerName }];
    sendSmtpEmail.subject = `Order Confirmation ${orderNumber} - Sathiko Pasal`;
    sendSmtpEmail.textContent = `
Dear ${customerName},

Thank you for your order with Sathiko Pasal!

Order Number: ${orderNumber}
Total Amount: $${total.toFixed(2)}
Order Date: ${new Date().toLocaleDateString('en-AU')}

Your fresh Nepali groceries are being prepared and will be delivered soon.

Questions? Contact us at support@sathikokirana.com.au

Thank you for choosing Sathiko Pasal!
Melbourne's premier Nepali grocery store.

Best regards,
The Sathiko Pasal Team
    `;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, emailId: response.messageId };

  } catch (error) {
    console.error('Failed to send simple email:', error);
    return { success: false, error: error.message };
  }
}; 
