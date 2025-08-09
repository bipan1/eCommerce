export const getOrderReceiptEmailHTML = ({
  customerName = 'Valued Customer',
  customerEmail = 'customer@example.com',
  orderNumber = '#SP-12345',
  orderDate = new Date().toLocaleDateString('en-AU'),
  items = [],
  subtotal = 0,
  shipping = 8.00,
  total = 0,
  deliveryAddress = {},
  isGuest = false
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sathikokirana.com.au';
  const previewText = `Order confirmation ${orderNumber} - Thank you for shopping with Sathiko Pasal!`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Sathiko Pasal</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
      font-family: 'Inter', Arial, sans-serif;
      line-height: 1.5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 32px 16px;
    }
    .section {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      padding: 24px;
      margin-bottom: 24px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      height: 48px;
      margin-bottom: 16px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #6b7280;
      font-size: 16px;
    }
    .heading {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 16px;
    }
    .row {
      display: flex;
      margin-bottom: 8px;
    }
    .col-half {
      flex: 1;
      padding-right: 16px;
    }
    .label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .value {
      font-size: 16px;
      color: #111827;
      font-weight: 500;
    }
    .item-row {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
      align-items: center;
    }
    .item-row:last-child {
      border-bottom: none;
    }
    .item-image {
      width: 56px;
      height: 56px;
      object-fit: cover;
      border-radius: 6px;
      margin-right: 16px;
    }
    .item-details {
      flex: 1;
    }
    .item-name {
      font-size: 16px;
      font-weight: 500;
      color: #111827;
      margin-bottom: 4px;
    }
    .item-info {
      font-size: 14px;
      color: #6b7280;
    }
    .item-price {
      font-size: 16px;
      font-weight: 500;
      color: #111827;
      text-align: right;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .summary-label {
      font-size: 16px;
      color: #374151;
    }
    .summary-value {
      font-size: 16px;
      color: #111827;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding-top: 12px;
      border-top: 2px solid #e5e7eb;
      margin-top: 12px;
    }
    .total-label {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }
    .total-value {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }
    .address-text {
      font-size: 16px;
      color: #111827;
      margin-bottom: 4px;
    }
    .address-details {
      font-size: 16px;
      color: #374151;
      margin-bottom: 4px;
    }
    .next-steps {
      background-color: #f0fdfa;
      border: 1px solid #5eead4;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .next-steps-title {
      font-size: 20px;
      font-weight: 600;
      color: #134e4a;
      margin-bottom: 16px;
    }
    .next-steps-item {
      font-size: 16px;
      color: #115e59;
      margin-bottom: 12px;
    }
    .contact-section {
      text-align: center;
    }
    .contact-title {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 16px;
    }
    .contact-text {
      font-size: 16px;
      color: #374151;
      margin-bottom: 16px;
    }
    .button {
      display: inline-block;
      background-color: #0d9488;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      font-size: 16px;
    }
    .website-link {
      font-size: 14px;
      color: #6b7280;
      margin-top: 16px;
    }
    .website-link a {
      color: #0d9488;
      text-decoration: none;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
    }
    .footer-text {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 8px;
    }
    @media only screen and (max-width: 600px) {
      .container {
        padding: 16px 8px;
      }
      .section {
        padding: 16px;
      }
      .row {
        flex-direction: column;
      }
      .col-half {
        padding-right: 0;
        margin-bottom: 8px;
      }
      .item-row {
        flex-direction: column;
        text-align: center;
      }
      .item-image {
        margin-right: 0;
        margin-bottom: 8px;
      }
    }
  </style>
</head>
<body>
  <div style="display: none; max-height: 0; overflow: hidden;">${previewText}</div>
  
  <div class="container">
    <!-- Header -->
    <div class="section header">
      <img src="${siteUrl}/headerfinal.png" alt="Sathiko Pasal" class="logo">
      <div class="title">🎉 Order Confirmed!</div>
      <div class="subtitle">Thank you for your order, ${customerName}! Your groceries are being prepared with care.</div>
    </div>

    <!-- Order Details -->
    <div class="section">
      <div class="heading">Order Details</div>
      <div class="row">
        <div class="col-half">
          <div class="label">Order Number</div>
          <div class="value">${orderNumber}</div>
        </div>
        <div class="col-half">
          <div class="label">Order Date</div>
          <div class="value">${orderDate}</div>
        </div>
      </div>
      <div class="row">
        <div class="col-half">
          <div class="label">Customer Email</div>
          <div class="value">${customerEmail}</div>
        </div>
        <div class="col-half">
          <div class="label">Customer Type</div>
          <div class="value">${isGuest ? 'Guest Checkout' : 'Registered Customer'}</div>
        </div>
      </div>
    </div>

    <!-- Items Ordered -->
    <div class="section">
      <div class="heading">Items Ordered</div>
      ${items.map(item => `
        <div class="item-row">
          <img src="${item.image}" alt="${item.name}" class="item-image">
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-info">Quantity: ${item.quantity} × $${item.price}</div>
          </div>
          <div class="item-price">$${(item.quantity * item.price).toFixed(2)}</div>
        </div>
      `).join('')}
    </div>

    <!-- Order Summary -->
    <div class="section">
      <div class="heading">Order Summary</div>
      <div class="summary-row">
        <div class="summary-label">Subtotal</div>
        <div class="summary-value">$${subtotal.toFixed(2)}</div>
      </div>
      <div class="summary-row">
        <div class="summary-label">Delivery Fee</div>
        <div class="summary-value">$${shipping.toFixed(2)}</div>
      </div>
      <div class="total-row">
        <div class="total-label">Total</div>
        <div class="total-value">$${total.toFixed(2)}</div>
      </div>
    </div>

    <!-- Delivery Address -->
    <div class="section">
      <div class="heading">Delivery Address</div>
      <div class="address-text">${customerName}</div>
      <div class="address-details">${deliveryAddress.addressLine || ''}</div>
      <div class="address-details">${deliveryAddress.suburb || ''}, ${deliveryAddress.state || ''} ${deliveryAddress.postcode || ''}</div>
    </div>

    <!-- What's Next -->
    <div class="next-steps">
      <div class="next-steps-title">📦 What happens next?</div>
      <div class="next-steps-item">1. <strong>Order Processing:</strong> We'll prepare your fresh groceries with care</div>
      <div class="next-steps-item">2. <strong>Quality Check:</strong> Every item is checked for freshness and quality</div>
      <div class="next-steps-item">3. <strong>Delivery:</strong> Your order will be delivered to your address</div>
      <div class="next-steps-item">4. <strong>Enjoy:</strong> Fresh Nepali groceries at your doorstep! 🥘</div>
    </div>

    <!-- Contact & Social -->
    <div class="section contact-section">
      <div class="contact-title">Thank you for choosing Sathiko Pasal! 🙏</div>
      <div class="contact-text">Melbourne's premier Nepali grocery store. Questions about your order?</div>
      <a href="mailto:support@sathikokirana.com.au" class="button">Contact Support</a>
      <div class="website-link">
        Visit us at <a href="https://www.sathikokirana.com.au">sathikokirana.com.au</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-text">This email was sent to ${customerEmail}. If you have any questions, please contact our support team.</div>
      <div class="footer-text">© 2025 Sathiko Kirana Pasal. All rights reserved.</div>
    </div>
  </div>
</body>
</html>
  `;
}; 