import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  // Using Gmail SMTP - you'll need to set up app passwords
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'your-email@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
    }
  });
};

export async function sendContactEmail(data: {
  to?: string;
  subject?: string;
  html?: string;
  name?: string;
  email?: string;
  reason?: string;
  message?: string;
}) {
  try {
    const transporter = createTransporter();

    // If it's a structured contact form (legacy format)
    if (data.name && data.email && data.reason && data.message) {
      const emailHtml = `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Reason:</strong> ${data.reason}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `;

      await transporter.sendMail({
        from: process.env.GMAIL_USER || 'savviwell@gmail.com',
        to: 'savviwell@gmail.com',
        subject: `New Contact Form Submission: ${data.reason}`,
        html: emailHtml
      });
    }
    // If it's a direct email (new format for waitlist notifications)
    else if (data.to && data.subject && data.html) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER || 'savviwell@gmail.com',
        to: data.to,
        subject: data.subject,
        html: data.html
      });
    }

    console.log('Email sent successfully');
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);

    // Log the email content as fallback
    console.log(`
===== EMAIL NOTIFICATION =====
To: ${data.to || 'savviwell@gmail.com'}
Subject: ${data.subject || 'Contact Form Submission'}
Content: ${data.html || `Name: ${data.name}, Email: ${data.email}, Reason: ${data.reason}, Message: ${data.message}`}
Timestamp: ${new Date().toISOString()}
==============================
    `);

    return { success: false, message: 'Failed to send email, but logged to console' };
  }
}

export async function sendWaitlistNotification(waitlistData: {
  name: string;
  email: string;
  userType: string;
  healthGoal: string;
  dietaryConcern: string;
}) {
  return await sendContactEmail({
    to: 'savviwell@gmail.com',
    subject: 'New Waitlist Signup - SavviWell',
    html: `
      <h3>New Waitlist Signup</h3>
      <p><strong>Name:</strong> ${waitlistData.name}</p>
      <p><strong>Email:</strong> ${waitlistData.email}</p>
      <p><strong>User Type:</strong> ${waitlistData.userType}</p>
      <p><strong>Health Goal:</strong> ${waitlistData.healthGoal}</p>
      <p><strong>Dietary Concern:</strong> ${waitlistData.dietaryConcern}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    `
  });
}

export async function sendNewsletterNotification(newsletterData: {
  email: string;
  name?: string;
}) {
  return await sendContactEmail({
    to: 'savviwell@gmail.com',
    subject: 'New Newsletter Signup - SavviWell',
    html: `
      <h3>New Newsletter Signup</h3>
      <p><strong>Email:</strong> ${newsletterData.email}</p>
      <p><strong>Name:</strong> ${newsletterData.name || 'Not provided'}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    `
  });
}