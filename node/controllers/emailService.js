// services/emailService.js
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services
  auth: {
    user: 'carppark13@gmail.com',
    pass: 'ebvh fszl adau fuhe'
  }
});

async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: 'carppark13@gmail.com',
    to: to,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { sendEmail };
