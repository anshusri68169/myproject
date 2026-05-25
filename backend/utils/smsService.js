import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    return result;
  } catch (error) {
    console.error('SMS send failed:', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

export const sendOTP = (phone, otp) => {
  const message = `Your QuickLift OTP is: ${otp}. Valid for 10 minutes.`;
  return sendSMS(phone, message);
};

export const sendOrderAssignmentSMS = (phone, orderId, pickupAddress) => {
  const message = `New order ${orderId} from ${pickupAddress}. Accept in the QuickLift app.`;
  return sendSMS(phone, message);
};

export const sendDeliveryPickupSMS = (phone, orderId) => {
  const message = `Order ${orderId} picked up. On the way!`;
  return sendSMS(phone, message);
};
