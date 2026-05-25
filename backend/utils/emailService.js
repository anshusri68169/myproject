import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Email send failed:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendPartnerApprovalEmail = (email, partnerName) => {
  const html = `
    <h2>Welcome to QuickLift, ${partnerName}!</h2>
    <p>Your delivery partner account has been approved.</p>
    <p>You can now start earning by delivering packages in Lucknow.</p>
    <p>Log in to your account and start accepting orders.</p>
  `;

  return sendEmail(email, 'Account Approved - QuickLift', html);
};

export const sendOrderConfirmationEmail = (email, orderId, fare) => {
  const html = `
    <h2>Order Confirmed!</h2>
    <p>Your order ${orderId} has been placed.</p>
    <p>Total Fare: ₹${fare}</p>
    <p>You can track your order in real-time using the QuickLift app.</p>
  `;

  return sendEmail(email, 'Order Confirmation - QuickLift', html);
};

export const sendDeliveryCompletionEmail = (email, orderId) => {
  const html = `
    <h2>Delivery Complete!</h2>
    <p>Your order ${orderId} has been successfully delivered.</p>
    <p>Please rate your delivery experience on the QuickLift app.</p>
  `;

  return sendEmail(email, 'Delivery Complete - QuickLift', html);
};
