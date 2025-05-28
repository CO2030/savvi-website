
// Simple email service using nodemailer
// Note: For production, you'd want to use a proper email service like SendGrid, Mailgun, etc.

export async function sendContactEmail(contactData: {
  name: string;
  email: string;
  reason: string;
  message: string;
}) {
  try {
    // For now, we'll just log the email content
    // In production, you'd integrate with an actual email service
    console.log(`
===== NEW CONTACT FORM SUBMISSION =====
From: ${contactData.name} (${contactData.email})
Reason: ${contactData.reason}
Message: ${contactData.message}
Timestamp: ${new Date().toISOString()}
======================================
    `);
    
    // TODO: Integrate with actual email service
    // Example with nodemailer (you'd need to install nodemailer and configure SMTP):
    /*
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      // Configure your email service here
    });
    
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: 'savviwell@gmail.com',
      subject: `New Contact Form Submission: ${contactData.reason}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Reason:</strong> ${contactData.reason}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message}</p>
      `
    });
    */
    
    return { success: true, message: 'Email logged successfully' };
  } catch (error) {
    console.error('Error sending contact email:', error);
    return { success: false, message: 'Failed to send email' };
  }
}
