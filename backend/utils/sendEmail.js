const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log(`📧 EMAIL LOG: Attempting to send email to ${options.email}...`);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ EMAIL SUCCESS: Sent to ${options.email}. ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ EMAIL ERROR: Failed to send to ${options.email}. Reason:`, error.message);
    throw error;
  }
};

module.exports = sendEmail;