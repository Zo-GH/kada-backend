const nodemailer = require('nodemailer');
const { config } = require('../config/config')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,       
  secure: true,   
  auth: {
    user: config.EMAIL_USER,      
    pass: config.EMAIL_PASS,        
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: 'support@kada.com',      
    to: toEmail,                      
    subject: 'Your OTP Code',          
    html: `
      <h2>Your OTP Code</h2>
      <p>Your one-time password (OTP) is: <strong>${otp}</strong></p>
      <p>Please use this code to complete your password update.</p>
      <p>Thank you!<p>
    `,  
    headers: {
      'X-Priority': '1',            
      'X-Mailer': 'NodeMailer',     
    },                             
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

module.exports = {
  sendOtpEmail,
}
