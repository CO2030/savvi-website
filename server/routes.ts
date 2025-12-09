import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertNewsletterSchema, insertContactSchema, insertReferralSchema, insertReferralCampaignSchema, insertShareEventSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { submitToGoogleScript, submitContactToGoogleScript } from "./services/googleScripts";
import { sendContactEmail, sendMealGuideEmail, sendInstagramGuideEmail } from "./services/emailService";
import { EmailReputationMonitor } from "./services/reputationMonitor";
import { config } from "./config";
import path from "path";

// Common crawler/bot user agents
const CRAWLER_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'LinkedInBot',
  'Twitterbot',
  'WhatsApp',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'Googlebot',
  'bingbot',
  'Pinterest',
  'vkShare',
  'Embedly',
  'Quora Link Preview',
  'Showyoubot'
];

// Check if request is from a crawler
const isCrawler = (userAgent: string | undefined): boolean => {
  if (!userAgent) return false;
  return CRAWLER_USER_AGENTS.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
};

// Generate podcast-specific HTML for crawlers
const getPodcastCrawlerHTML = (): string => {
  const title = "SavviWell Podcast | Wellbeing for Modern Life";
  const description = "A wellbeing podcast for real life with Meara and Christina. Honest conversations, practical tools, and free guides to help you feel calmer and more supported.";
  const url = "https://savviwell.com/podcast";
  const image = "https://savviwell.com/images/podcast-share.png";
  const favicon = "https://savviwell.com/favicon.png";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="icon" type="image/png" href="${favicon}">
  <link rel="shortcut icon" href="${favicon}">
  <link rel="apple-touch-icon" href="${favicon}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:site_name" content="SavviWell">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
</body>
</html>`;
};

// Podcast routes that should use podcast meta
const PODCAST_ROUTES = ['/podcast', '/instagram-teen-guide'];

// Crawler meta middleware for podcast routes
const crawlerMetaMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const pathname = req.path;
  const userAgent = req.headers['user-agent'];
  
  // Check if this is a podcast route and request is from a crawler
  const isPodcastRoute = PODCAST_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
  
  if (isPodcastRoute && isCrawler(userAgent)) {
    return res.status(200).set({ 'Content-Type': 'text/html' }).send(getPodcastCrawlerHTML());
  }
  
  next();
};

// Admin authentication middleware
const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const session = req.session as any;
  if (session && session.adminAuthenticated) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized - Admin access required" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Register crawler meta middleware for podcast routes (must be before catch-all)
  app.use(crawlerMetaMiddleware);

  // Verify access token for meal guide
  app.get('/api/verify-access', async (req: Request, res: Response) => {
    try {
      const token = req.query.token as string;
      
      if (!token) {
        return res.json({ valid: false });
      }
      
      const entry = await storage.getWaitlistEntryByToken(token);
      
      if (entry) {
        return res.json({ 
          valid: true, 
          name: entry.name,
          email: entry.email
        });
      } else {
        return res.json({ valid: false });
      }
    } catch (error) {
      console.error('Error verifying access token:', error);
      return res.json({ valid: false });
    }
  });

  // Download meal guide PDF (requires valid access token)
  app.get('/api/download-meal-guide', async (req: Request, res: Response) => {
    const { token } = req.query;
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
    
    // Verify the token exists in the database
    const user = await storage.getWaitlistEntryByToken(token as string);
    if (!user) {
      return res.status(403).json({ message: 'Invalid or expired access token' });
    }
    
    const filePath = path.join(process.cwd(), 'server/assets/SavviWell-5-Day-Meals.pdf');
    res.download(filePath, 'SavviWell-5-Day-Meals.pdf', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file');
      }
    });
  });

  // Download Instagram teen accounts guide PDF (requires valid access token)
  app.get('/api/download-instagram-guide', async (req: Request, res: Response) => {
    const { token } = req.query;
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
    
    // Verify the token exists in the database
    const user = await storage.getWaitlistEntryByToken(token as string);
    if (!user) {
      return res.status(403).json({ message: 'Invalid or expired access token' });
    }
    
    const filePath = path.join(process.cwd(), 'server/assets/Instagram-Teen-Accounts-Guide.pdf');
    res.download(filePath, 'Instagram-Teen-Accounts-Guide.pdf', (err) => {
      if (err) {
        console.error('Error downloading Instagram guide file:', err);
        res.status(500).send('Error downloading file');
      }
    });
  });

  // Waitlist endpoint
  app.post("/api/waitlist", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validatedData = insertWaitlistSchema.parse(req.body);

      // Check if email already exists
      const existingEntry = await storage.getWaitlistEntryByEmail(validatedData.email);

      if (existingEntry) {
        return res.status(400).json({
          message: "Email already registered for the waitlist",
          alreadyRegistered: true
        });
      }

      // Create waitlist entry in local storage
      const newEntry = await storage.createWaitlistEntry(validatedData);

      // Check if this person was referred and mark referral as completed
      try {
        await storage.markReferralAsSignedUp(validatedData.email);
        // Check for achievements
        const allReferrals = await storage.getAllReferrals();
        const referral = allReferrals.find(r => r.referredEmail === validatedData.email);
        if (referral && referral.campaignId) {
          await storage.checkAndCreateAchievement(referral.referrerEmail, referral.campaignId);
        }
      } catch (error) {
        console.log('No referral found or error checking referral:', error);
      }

      // Determine which guide to send based on source
      const isInstagramGuide = validatedData.source?.includes('instagram-teen-guide');
      
      // Send appropriate guide email to user
      try {
        console.log(`🔄 Starting email send process for ${validatedData.email}`);
        let emailSent = false;
        
        if (isInstagramGuide) {
          emailSent = await sendInstagramGuideEmail({
            to: validatedData.email,
            name: validatedData.name,
            accessToken: newEntry.accessToken || ''
          });
          if (emailSent) {
            console.log(`✅ Instagram guide email successfully sent to ${validatedData.email}`);
          } else {
            console.log(`❌ Failed to send Instagram guide email to ${validatedData.email}`);
          }
        } else {
          emailSent = await sendMealGuideEmail({
            to: validatedData.email,
            name: validatedData.name,
            accessToken: newEntry.accessToken || ''
          });
          if (emailSent) {
            console.log(`✅ Meal guide email successfully sent to ${validatedData.email}`);
          } else {
            console.log(`❌ Failed to send meal guide email to ${validatedData.email}`);
          }
        }
      } catch (error) {
        console.error('❌ Exception while sending guide email:', error);
        // Don't fail the request if email fails
      }

      // Send email notification to admin with source identification
      try {
        const isLeadMagnet = validatedData.source?.includes('3-day-lead-magnet') || validatedData.source?.includes('lead-magnet');
        const isInstagramGuideSignup = validatedData.source?.includes('instagram-teen-guide');
        
        let notificationType = "📋 New Waitlist Signup";
        let subjectType = "Waitlist";
        let bgColor = '#399E5A';
        let bgBoxColor = '#f0f8f4';
        let guideType = '📝 Regular Waitlist';
        let emailNote = '';
        
        if (isInstagramGuideSignup) {
          notificationType = "📱 New Instagram Teen Guide Signup";
          subjectType = "Instagram Guide";
          bgColor = '#9333ea';
          bgBoxColor = '#f3e8ff';
          guideType = '📱 Instagram Teen Accounts Guide';
          emailNote = '<p style="color: #9333ea; font-weight: bold;">✅ User automatically received Instagram Teen Accounts Guide email with PDF attachment</p>';
        } else if (isLeadMagnet) {
          notificationType = "📱 New Lead Magnet Signup";
          subjectType = "Lead Magnet";
          bgColor = '#ff9800';
          bgBoxColor = '#fff3e0';
          guideType = '🎯 3-Day Meals Lead Magnet';
          emailNote = '<p style="color: #ff9800; font-weight: bold;">✅ User automatically received 3-Day Meals Guide email with PDF attachment</p>';
        }
        
        await sendContactEmail({
          to: "hello@savviwell.com",
          subject: `New ${subjectType} Signup - SavviWell`,
          html: `
            <h2 style="color: ${bgColor};">${notificationType}</h2>
            <div style="background-color: ${bgBoxColor}; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <p><strong>Name:</strong> ${validatedData.name}</p>
              <p><strong>Email:</strong> ${validatedData.email}</p>
              <p><strong>User Type:</strong> ${validatedData.userType}</p>
              <p><strong>Health Goal:</strong> ${validatedData.healthGoal}</p>
              <p><strong>Dietary Concern:</strong> ${validatedData.dietaryConcern}</p>
              <p><strong>Source:</strong> ${validatedData.source || 'Direct'}</p>
              <p><strong>Signup Type:</strong> ${guideType}</p>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            </div>
            ${emailNote}
          `
        });
      } catch (emailError) {
        console.warn("Failed to send email notification:", emailError);
        // Continue with normal flow even if email fails
      }

      // Get Google Script deployment URL from config
      const deploymentUrl = config.googleScriptDeploymentUrl;

      // Send to Google Sheet if deployment URL is available
      if (deploymentUrl) {
        const googleSubmitResult = await submitToGoogleScript(deploymentUrl, {
          name: validatedData.name,
          email: validatedData.email,
          userType: validatedData.userType,
          healthGoal: validatedData.healthGoal,
          dietaryConcern: validatedData.dietaryConcern,
          source: validatedData.source || 'Direct'
        });

        if (!googleSubmitResult.success) {
          console.warn("Google Sheet submission failed:", googleSubmitResult.message);
          // Continue with local storage only
        }
      } else {
        console.warn("No Google Script deployment URL set in environment variables");
      }

      // Return success response with access token
      return res.status(201).json({
        message: "Successfully joined the waitlist",
        id: newEntry.id,
        accessToken: newEntry.accessToken
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        console.error("Validation error details:", {
          receivedData: req.body,
          validationErrors: error.errors
        });
        return res.status(400).json({
          message: "Validation error",
          details: validationError.message
        });
      }

      console.error("Error creating waitlist entry:", error);
      return res.status(500).json({
        message: "An error occurred while processing your request"
      });
    }
  });

  // Unsubscribe endpoint
  app.get("/unsubscribe", async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      
      if (!token) {
        return res.status(400).send(`
          <html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
            <h2 style="color: #e74c3c;">Invalid Unsubscribe Link</h2>
            <p>The unsubscribe link is missing required information.</p>
            <p><a href="mailto:hello@savviwell.com">Contact support</a> if you need assistance.</p>
          </body></html>
        `);
      }

      // Find user by access token
      const user = await storage.getWaitlistEntryByToken(token as string);
      
      if (!user) {
        return res.status(404).send(`
          <html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
            <h2 style="color: #e74c3c;">Unsubscribe Link Not Found</h2>
            <p>This unsubscribe link is no longer valid or has already been used.</p>
            <p><a href="mailto:hello@savviwell.com">Contact support</a> if you continue to receive emails.</p>
          </body></html>
        `);
      }

      // Mark user as unsubscribed in database
      const unsubscribedUser = await storage.unsubscribeUser(token as string);
      
      if (!unsubscribedUser) {
        return res.status(500).send(`
          <html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
            <h2 style="color: #e74c3c;">Error Processing Unsubscribe</h2>
            <p>We encountered an error processing your unsubscribe request.</p>
            <p>Please <a href="mailto:hello@savviwell.com">contact support</a> and we'll manually remove you from our list.</p>
          </body></html>
        `);
      }
      
      return res.status(200).send(`
        <html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center;">
          <h2 style="color: #399E5A;">Unsubscribe Successful</h2>
          <p>Hello ${user.name},</p>
          <p>You have been successfully unsubscribed from SavviWell emails.</p>
          <p>We're sorry to see you go! If you change your mind, you can always sign up again at <a href="https://savviwell.com">savviwell.com</a></p>
          <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <p style="margin: 0;"><strong>Email:</strong> ${user.email}</p>
            <p style="margin: 5px 0 0 0;"><strong>Unsubscribed:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin: 5px 0 0 0;"><strong>Status:</strong> <span style="color: #dc3545;">Unsubscribed</span></p>
          </div>
          <p style="margin-top: 20px;"><a href="mailto:hello@savviwell.com">Contact us</a> if you have any questions.</p>
        </body></html>
      `);
    } catch (error) {
      console.error("Error in unsubscribe:", error);
      return res.status(500).send(`
        <html><body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
          <h2 style="color: #e74c3c;">Error Processing Unsubscribe</h2>
          <p>We encountered an error processing your unsubscribe request.</p>
          <p>Please <a href="mailto:hello@savviwell.com">contact support</a> and we'll manually remove you from our list.</p>
        </body></html>
      `);
    }
  });

  // Admin endpoint for email reputation monitoring
  app.get("/api/admin/email-reputation", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const report = EmailReputationMonitor.getWeeklyReport();
      return res.json(report);
    } catch (error) {
      console.error("Error getting email reputation report:", error);
      return res.status(500).json({ message: "Error fetching reputation data" });
    }
  });

  // Admin endpoint for unsubscribe analytics
  app.get("/api/admin/unsubscribe-analytics", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const analytics = await storage.getUnsubscribeAnalytics();
      return res.json(analytics);
    } catch (error) {
      console.error("Error getting unsubscribe analytics:", error);
      return res.status(500).json({ message: "Error fetching unsubscribe data" });
    }
  });

  // Admin login endpoint
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      
      if (password === "KalmarLisbon00025") {
        const session = req.session as any;
        session.adminAuthenticated = true;
        return res.status(200).json({ message: "Authentication successful" });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      console.error("Error in admin login:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", async (req: Request, res: Response) => {
    try {
      const session = req.session as any;
      session.adminAuthenticated = false;
      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error in admin logout:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Resend email endpoint
  app.post("/api/resend-email", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find the user in the waitlist
      const user = await storage.getWaitlistEntryByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "Email not found in waitlist" });
      }

      // Send meal guide email
      console.log(`🔄 Resending email for ${user.email}`);
      
      if (!user.accessToken) {
        return res.status(400).json({ message: "User does not have an access token" });
      }
      
      const emailSent = await sendMealGuideEmail({
        to: user.email,
        name: user.name,
        accessToken: user.accessToken
      });

      if (emailSent) {
        return res.status(200).json({ 
          message: "Email resent successfully",
          email: user.email,
          name: user.name 
        });
      } else {
        return res.status(500).json({ message: "Failed to send email" });
      }
    } catch (error) {
      console.error("Error resending email:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Check admin authentication status
  app.get("/api/admin/status", async (req: Request, res: Response) => {
    try {
      const session = req.session as any;
      const isAuthenticated = !!(session && session.adminAuthenticated);
      return res.status(200).json({ authenticated: isAuthenticated });
    } catch (error) {
      console.error("Error checking admin status:", error);
      return res.status(500).json({ authenticated: false });
    }
  });

  // Get all waitlist entries (protected admin route)
  app.get("/api/waitlist", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const entries = await storage.getAllWaitlistEntries();
      return res.status(200).json(entries);
    } catch (error) {
      console.error("Error fetching waitlist entries:", error);
      return res.status(500).json({
        message: "An error occurred while fetching waitlist entries"
      });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validatedData = insertNewsletterSchema.parse(req.body);

      // Check if email already exists
      const existingSubscriber = await storage.getNewsletterSubscriberByEmail(validatedData.email);

      if (existingSubscriber) {
        return res.status(200).json({
          message: "Email already subscribed to the newsletter",
          alreadySubscribed: true
        });
      }

      // Create newsletter subscriber in database
      const newSubscriber = await storage.createNewsletterSubscriber(validatedData);

      // Send email notification immediately
      // await sendNewsletterNotification({
      //   email: validatedData.email,
      //   name: validatedData.name
      // });

      // Submit to Google Sheet if deployment URL is available
      const deploymentUrl = config.googleScriptDeploymentUrl;
      if (deploymentUrl) {
        const googleSubmitResult = await submitToGoogleScript(deploymentUrl, {
          name: validatedData.name || '',
          email: validatedData.email,
          userType: 'individual', // Default for newsletter
          healthGoal: 'energy', // Default for newsletter
          dietaryConcern: 'none', // Default for newsletter
          source: validatedData.source || 'Direct'
        });

        if (!googleSubmitResult.success) {
          console.warn("Google Sheet newsletter submission failed:", googleSubmitResult.message);
          // Continue with database storage only
        }
      }

      return res.status(201).json({
        message: "Successfully subscribed to the newsletter",
        id: newSubscriber.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          details: validationError.message
        });
      }

      console.error("Error subscribing to newsletter:", error);
      return res.status(500).json({
        message: "An error occurred while processing your request"
      });
    }
  });

  // Get all newsletter subscribers (protected admin route)
  app.get("/api/newsletter", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      return res.status(200).json(subscribers);
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      return res.status(500).json({
        message: "An error occurred while fetching newsletter subscribers"
      });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validatedData = insertContactSchema.parse(req.body);

      // Create contact submission in database
      const newSubmission = await storage.createContactSubmission(validatedData);

      // Send email notification immediately
      await sendContactEmail({
        to: "hello@savviwell.com",
        subject: `New Contact Form Submission - ${validatedData.reason}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Reason:</strong> ${validatedData.reason}</p>
          <p><strong>Message:</strong> ${validatedData.message}</p>
          <p><strong>Source:</strong> ${validatedData.source || 'Direct'}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        `
      });

      // Submit to Google Sheet if deployment URL is available
      const deploymentUrl = config.googleScriptDeploymentUrl;
      if (deploymentUrl) {
        const googleSubmitResult = await submitContactToGoogleScript(deploymentUrl, {
          name: validatedData.name,
          email: validatedData.email,
          reason: validatedData.reason,
          message: validatedData.message,
          source: validatedData.source || 'Direct'
        });

        if (!googleSubmitResult.success) {
          console.warn("Google Sheet contact submission failed:", googleSubmitResult.message);
          // Continue with database storage only
        }
      }

      return res.status(201).json({
        message: "Contact form submitted successfully",
        id: newSubmission.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          details: validationError.message
        });
      }

      console.error("Error processing contact form:", error);
      return res.status(500).json({
        message: "An error occurred while processing your request"
      });
    }
  });

  // Get all contact submissions (protected admin route)
  app.get("/api/contact", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      return res.status(200).json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      return res.status(500).json({
        message: "An error occurred while fetching contact submissions"
      });
    }
  });

  // Delete waitlist entry (protected admin route)
  app.delete("/api/waitlist/:id", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const entryId = parseInt(req.params.id);
      await storage.deleteWaitlistEntry(entryId);
      return res.status(200).json({ message: "Waitlist entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting waitlist entry:", error);
      return res.status(500).json({
        message: "An error occurred while deleting the entry"
      });
    }
  });

  // Delete contact submission (protected admin route)
  app.delete("/api/contact/:id", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const submissionId = parseInt(req.params.id);
      await storage.deleteContactSubmission(submissionId);
      return res.status(200).json({ message: "Contact submission deleted successfully" });
    } catch (error) {
      console.error("Error deleting contact submission:", error);
      return res.status(500).json({
        message: "An error occurred while deleting the submission"
      });
    }
  });

  // Export all collected emails
  app.get("/api/export/emails", async (req: Request, res: Response) => {
    try {
      const waitlistEntries = await storage.getAllWaitlistEntries();
      const contactSubmissions = await storage.getAllContactSubmissions();
      const newsletterSubscribers = await storage.getAllNewsletterSubscribers();

      const allEmails = [
        ...waitlistEntries.map(entry => ({ email: entry.email, source: 'waitlist', name: entry.name, date: entry.createdAt })),
        ...contactSubmissions.map(submission => ({ email: submission.email, source: 'contact', name: submission.name, date: submission.createdAt })),
        ...newsletterSubscribers.map(subscriber => ({ email: subscriber.email, source: 'newsletter', name: subscriber.name || '', date: subscriber.createdAt }))
      ];

      // Remove duplicates by email
      const uniqueEmails = allEmails.filter((email, index, self) => 
        index === self.findIndex((e) => e.email === email.email)
      );

      return res.status(200).json({
        total: uniqueEmails.length,
        emails: uniqueEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      });
    } catch (error) {
      console.error("Error exporting emails:", error);
      return res.status(500).json({
        message: "Error exporting emails"
      });
    }
  });

  // Test endpoint to add sample data (for testing the admin dashboard grouping)
  app.post("/api/test/add-sample-data", async (req: Request, res: Response) => {
    try {
      // Sample waitlist entries with different user types and health goals
      const sampleWaitlistEntries = [
        {
          name: "Alice Johnson",
          email: "alice@example.com",
          userType: "individual",
          healthGoal: "weight-loss",
          dietaryConcern: "gluten-free",
          source: "test-data"
        },
        {
          name: "Bob Smith",
          email: "bob@example.com",
          userType: "individual", 
          healthGoal: "weight-loss",
          dietaryConcern: "none",
          source: "test-data"
        },
        {
          name: "Carol Williams",
          email: "carol@example.com",
          userType: "parent",
          healthGoal: "energy",
          dietaryConcern: "none",
          source: "test-data"
        },
        {
          name: "David Brown",
          email: "david@example.com",
          userType: "caregiver",
          healthGoal: "gut-health",
          dietaryConcern: "vegan",
          source: "test-data"
        },
        {
          name: "Emma Davis",
          email: "emma@example.com",
          userType: "older-adult",
          healthGoal: "blood-sugar",
          dietaryConcern: "low-sugar",
          source: "test-data"
        }
      ];

      // Sample contact submissions with different reasons
      const sampleContactSubmissions = [
        {
          name: "Frank Wilson",
          email: "frank@example.com",
          reason: "partnership",
          message: "I'm interested in exploring partnership opportunities with SavviWell for our clinic."
        },
        {
          name: "Grace Miller",
          email: "grace@example.com",
          reason: "general",
          message: "When will the platform be available? I'm very excited to try it!"
        },
        {
          name: "Henry Taylor",
          email: "henry@example.com",
          reason: "support",
          message: "I signed up for the waitlist but haven't received a confirmation email."
        },
        {
          name: "Ivy Anderson",
          email: "ivy@example.com",
          reason: "partnership",
          message: "Our hospital would like to discuss integrating SavviWell into our patient care program."
        },
        {
          name: "Jack Thompson",
          email: "jack@example.com",
          reason: "general",
          message: "Does SavviWell support vegetarian meal planning?"
        }
      ];

      // Add waitlist entries with proper types
      for (const entry of sampleWaitlistEntries) {
        await storage.createWaitlistEntry({
          ...entry,
          userType: entry.userType as "individual" | "parent" | "caregiver" | "older-adult",
          healthGoal: entry.healthGoal as "energy" | "gut-health" | "blood-sugar" | "weight-loss" | "other",
          dietaryConcern: entry.dietaryConcern as "gluten-free" | "vegan" | "low-sugar" | "none"
        });
      }

      // Add contact submissions
      for (const submission of sampleContactSubmissions) {
        await storage.createContactSubmission(submission);
      }

      return res.status(200).json({
        message: "Sample data added successfully",
        waitlistEntries: sampleWaitlistEntries.length,
        contactSubmissions: sampleContactSubmissions.length
      });
    } catch (error) {
      console.error("Error adding sample data:", error);
      return res.status(500).json({
        message: "Error adding sample data"
      });
    }
  });

  // ============ REFERRAL SYSTEM ENDPOINTS ============

  // Get active referral campaign
  app.get("/api/referral/campaign", async (req: Request, res: Response) => {
    try {
      const campaign = await storage.getActiveCampaign();
      return res.status(200).json(campaign || null);
    } catch (error) {
      console.error("Error fetching active campaign:", error);
      return res.status(500).json({ message: "Error fetching campaign" });
    }
  });

  // Submit a referral
  app.post("/api/referral", async (req: Request, res: Response) => {
    try {
      const validatedData = insertReferralSchema.parse(req.body);

      // Get active campaign
      const activeCampaign = await storage.getActiveCampaign();
      if (!activeCampaign) {
        return res.status(400).json({ message: "No active referral campaign" });
      }

      // Check if this person has already referred this email
      const existingReferrals = await storage.getReferralsByReferrer(validatedData.referrerEmail);
      const alreadyReferred = existingReferrals.some(r => r.referredEmail === validatedData.referredEmail);
      
      if (alreadyReferred) {
        return res.status(400).json({ message: "You have already referred this person" });
      }

      // Create the referral
      const referral = await storage.createReferral({
        ...validatedData,
        campaignId: activeCampaign.id
      });

      return res.status(201).json({
        message: "Referral submitted successfully",
        referral,
        campaignInfo: {
          name: activeCampaign.name,
          description: activeCampaign.description,
          requiredReferrals: activeCampaign.requiredreferrals
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          details: validationError.message
        });
      }

      console.error("Error submitting referral:", error);
      return res.status(500).json({ message: "Error submitting referral" });
    }
  });

  // Get referral progress for a specific user
  app.get("/api/referral/progress/:email", async (req: Request, res: Response) => {
    try {
      const email = req.params.email;
      const activeCampaign = await storage.getActiveCampaign();
      
      if (!activeCampaign) {
        return res.status(200).json({
          referrals: [],
          completedReferrals: 0,
          requiredReferrals: 0,
          qualified: false
        });
      }

      const referrals = await storage.getReferralsByReferrer(email);
      const campaignReferrals = referrals.filter(r => r.campaignId === activeCampaign.id);
      const completedReferrals = campaignReferrals.filter(r => r.signupCompleted).length;
      
      return res.status(200).json({
        referrals: campaignReferrals,
        completedReferrals,
        requiredReferrals: activeCampaign.requiredreferrals,
        qualified: completedReferrals >= activeCampaign.requiredreferrals,
        campaign: activeCampaign
      });
    } catch (error) {
      console.error("Error fetching referral progress:", error);
      return res.status(500).json({ message: "Error fetching progress" });
    }
  });

  // Mark a referral as signed up (called when referred person joins waitlist)
  app.post("/api/referral/signup/:email", async (req: Request, res: Response) => {
    try {
      const referredEmail = req.params.email;
      
      // Mark the referral as completed
      await storage.markReferralAsSignedUp(referredEmail);
      
      // Find who referred this person and check for achievements
      const allReferrals = await storage.getAllReferrals();
      const referral = allReferrals.find(r => r.referredEmail === referredEmail);
      
      if (referral && referral.campaignId) {
        const achievement = await storage.checkAndCreateAchievement(
          referral.referrerEmail, 
          referral.campaignId
        );
        
        if (achievement) {
          return res.status(200).json({
            message: "Referral marked as signed up and achievement unlocked!",
            achievement
          });
        }
      }

      return res.status(200).json({
        message: "Referral marked as signed up"
      });
    } catch (error) {
      console.error("Error marking referral signup:", error);
      return res.status(500).json({ message: "Error updating referral" });
    }
  });

  // Admin: Get all referrals (protected)
  app.get("/api/admin/referrals", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const referrals = await storage.getAllReferrals();
      const campaigns = await storage.getAllReferralCampaigns();
      const achievements = await storage.getAllAchievements();
      
      return res.status(200).json({
        referrals,
        campaigns,
        achievements
      });
    } catch (error) {
      console.error("Error fetching referral data:", error);
      return res.status(500).json({ message: "Error fetching referral data" });
    }
  });

  // Admin: Create new referral campaign (protected)
  app.post("/api/admin/referral-campaign", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertReferralCampaignSchema.parse(req.body);
      const campaign = await storage.createReferralCampaign(validatedData);
      
      return res.status(201).json({
        message: "Campaign created successfully",
        campaign
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          details: validationError.message
        });
      }

      console.error("Error creating campaign:", error);
      return res.status(500).json({ message: "Error creating campaign" });
    }
  });

  // ============ SHARE TRACKING ENDPOINTS ============

  // Track share event
  app.post("/api/share-event", async (req: Request, res: Response) => {
    try {
      const validatedData = insertShareEventSchema.parse(req.body);
      const shareEvent = await storage.createShareEvent(validatedData);
      
      res.status(201).json({
        message: "Share event tracked successfully",
        id: shareEvent.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          message: "Validation error",
          details: validationError.message
        });
      }
      
      console.error("Error tracking share event:", error);
      return res.status(500).json({
        message: "An error occurred while tracking share"
      });
    }
  });

  // Share analytics endpoint (admin only)
  app.get("/api/admin/share-analytics", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const analytics = await storage.getShareAnalytics();
      res.status(200).json(analytics);
    } catch (error) {
      console.error("Error getting share analytics:", error);
      return res.status(500).json({
        message: "An error occurred while getting analytics"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}