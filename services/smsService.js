const twilio = require('twilio');
const { config } = require('../config/config')


const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const sendOTPSMS = async (phoneNumber, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: config.TWILIO_PHONE_NUMBER, 
      to: phoneNumber,                      
    });
    console.log(`OTP SMS sent to ${phoneNumber}`);
  } catch (error) {
    console.error('Error sending OTP SMS:', error);
    throw new Error('Error sending OTP SMS');
  }
};

module.exports = {
  sendOTPSMS,
};
