
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

export async function sendWaitlistNotification(waitlistData: {
  name: string;
  email: string;
  userType: string;
  healthGoal: string;
  dietaryConcern: string;
}) {
  try {
    console.log(`
===== NEW WAITLIST SIGNUP =====
Name: ${waitlistData.name}
Email: ${waitlistData.email}
User Type: ${waitlistData.userType}
Health Goal: ${waitlistData.healthGoal}
Dietary Concern: ${waitlistData.dietaryConcern}
Timestamp: ${new Date().toISOString()}
===============================
    `);
    
    // TODO: Integrate with actual email service for instant notifications
    /*
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: 'savviwell@gmail.com',
      subject: 'New Waitlist Signup - SavviWell',
      html: `
        <h3>New Waitlist Signup</h3>
        <p><strong>Name:</strong> ${waitlistData.name}</p>
        <p><strong>Email:</strong> ${waitlistData.email}</p>
        <p><strong>User Type:</strong> ${waitlistData.userType}</p>
        <p><strong>Health Goal:</strong> ${waitlistData.healthGoal}</p>
        <p><strong>Dietary Concern:</strong> ${waitlistData.dietaryConcern}</p>
      `
    });
    */
    
    return { success: true, message: 'Waitlist notification logged successfully' };
  } catch (error) {
    console.error('Error sending waitlist notification:', error);
    return { success: false, message: 'Failed to send waitlist notification' };
  }
}

export async function sendNewsletterNotification(newsletterData: {
  email: string;
  name?: string;
}) {
  try {
    console.log(`
===== NEW NEWSLETTER SIGNUP =====
Email: ${newsletterData.email}
Name: ${newsletterData.name || 'Not provided'}
Timestamp: ${new Date().toISOString()}
=================================
    `);
    
    // TODO: Integrate with actual email service for instant notifications
    /*
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: 'savviwell@gmail.com',
      subject: 'New Newsletter Signup - SavviWell',
      html: `
        <h3>New Newsletter Signup</h3>
        <p><strong>Email:</strong> ${newsletterData.email}</p>
        <p><strong>Name:</strong> ${newsletterData.name || 'Not provided'}</p>
      `
    });
    */
    
    return { success: true, message: 'Newsletter notification logged successfully' };
  } catch (error) {
    console.error('Error sending newsletter notification:', error);
    return { success: false, message: 'Failed to send newsletter notification' };
  }
}
