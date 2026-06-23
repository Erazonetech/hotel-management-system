import nodemailer  from 'nodemailer';

let transporter;

const initializeEmailService = () => {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  console.log('✅ Email service initialized');
};

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"Hotel Restaurant" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

// Specific email templates
const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF6B6B;">Welcome to Hotel Restaurant!</h1>
      <p>Dear ${user.name},</p>
      <p>Thank you for registering with us. We're excited to have you!</p>
      <p>With your account, you can:</p>
      <ul>
        <li>Browse our delicious menu</li>
        <li>Place orders online</li>
        <li>Reserve tables</li>
        <li>Track your order status in real-time</li>
      </ul>
      <p>Start exploring our menu and enjoy a great dining experience!</p>
      <a href="${process.env.FRONTEND_URL}/menu" style="background-color: #FF6B6B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Browse Menu</a>
      <p style="margin-top: 30px;">Best regards,<br>Hotel Restaurant Team</p>
    </div>
  `;
  
  await sendEmail({
    email: user.email,
    subject: 'Welcome to Hotel Restaurant!',
    html
  });
};

const sendOrderConfirmation = async (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td>${item.name} x ${item.quantity}</td>
      <td>$${item.price}</td>
    </tr>
  `).join('');
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF6B6B;">Order Confirmation</h1>
      <p>Dear ${user.name},</p>
      <p>Your order has been confirmed! Order #: <strong>${order.orderNumber}</strong></p>
      
      <h2>Order Details:</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr><th style="text-align: left;">Item</th><th>Price</th></tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr style="border-top: 2px solid #ddd;">
            <td><strong>Total:</strong></td>
            <td><strong>$${order.total}</strong></td>
          </tr>
        </tbody>
      </table>
      
      <p>Estimated preparation time: ${order.estimatedCompletionTime || '30 minutes'}</p>
      <p>You can track your order status in real-time from your dashboard.</p>
      
      <a href="${process.env.FRONTEND_URL}/orders/${order._id}" style="background-color: #FF6B6B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Order</a>
      
      <p style="margin-top: 30px;">Thank you for choosing us!<br>Hotel Restaurant Team</p>
    </div>
  `;
  
  await sendEmail({
    email: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html
  });
};

const sendReservationConfirmation = async (reservation, customer) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF6B6B;">Reservation Confirmed!</h1>
      <p>Dear ${customer.name},</p>
      <p>Your table reservation has been confirmed!</p>
      
      <h2>Reservation Details:</h2>
      <p><strong>Reservation #:</strong> ${reservation.reservationNumber}</p>
      <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${reservation.time}</p>
      <p><strong>Guests:</strong> ${reservation.numberOfGuests}</p>
      <p><strong>Table:</strong> ${reservation.table?.tableNumber || 'Assigned at arrival'}</p>
      
      <p>Please arrive on time. Your table will be held for 15 minutes.</p>
      
      <a href="${process.env.FRONTEND_URL}/reservations/${reservation._id}" style="background-color: #FF6B6B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Reservation</a>
      
      <p style="margin-top: 30px;">We look forward to serving you!<br>Hotel Restaurant Team</p>
    </div>
  `;
  
  await sendEmail({
    email: customer.email,
    subject: `Reservation Confirmed - ${reservation.reservationNumber}`,
    html
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF6B6B;">Reset Your Password</h1>
      <p>Dear ${user.name},</p>
      <p>You requested to reset your password. Click the button below to create a new password:</p>
      
      <a href="${resetUrl}" style="background-color: #FF6B6B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      
      <p style="margin-top: 30px;">Best regards,<br>Hotel Restaurant Team</p>
    </div>
  `;
  
  await sendEmail({
    email: user.email,
    subject: 'Password Reset Request',
    html
  });
};

export {
  initializeEmailService,
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendReservationConfirmation,
  sendPasswordResetEmail
};