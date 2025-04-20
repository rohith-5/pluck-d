const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates
const templates = {
  orderConfirmation: (order) => `
    <h2>Order Confirmation</h2>
    <p>Thank you for your order!</p>
    <h3>Order Details:</h3>
    <p>Order ID: ${order.id}</p>
    <p>Status: ${order.status}</p>
    <p>Total Items: ${order.items.length}</p>
    <p>Delivery Address: ${order.deliveryAddress}</p>
    <p>You can track your order status at: ${process.env.FRONTEND_URL}/track</p>
  `,
  
  statusUpdate: (order) => `
    <h2>Order Status Update</h2>
    <p>Your order status has been updated.</p>
    <h3>Order Details:</h3>
    <p>Order ID: ${order.id}</p>
    <p>New Status: ${order.status}</p>
    <p>You can track your order status at: ${process.env.FRONTEND_URL}/track</p>
  `
};

// Function to send emails
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Function to send order confirmation email
const sendOrderConfirmationEmail = async (order, userEmail) => {
  const subject = 'Order Confirmation - Pluckd';
  const html = templates.orderConfirmation(order);
  await sendEmail(userEmail, subject, html);
};

// Function to send status update email
const sendStatusUpdateEmail = async (order, userEmail) => {
  const subject = 'Order Status Update - Pluckd';
  const html = templates.statusUpdate(order);
  await sendEmail(userEmail, subject, html);
};

module.exports = {
  sendOrderConfirmationEmail,
  sendStatusUpdateEmail
}; 