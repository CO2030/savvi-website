import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertNewsletterSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { submitToGoogleScript, submitContactToGoogleScript } from "./services/googleScripts";
import { sendContactEmail, sendMealGuideEmail } from "./services/emailService";
import { config } from "./config";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
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
          name: entry.name 
        });
      } else {
        return res.json({ valid: false });
      }
    } catch (error) {
      console.error('Error verifying access token:', error);
      return res.json({ valid: false });
    }
  });

  // Download meal guide PDF
  app.get('/api/download-meal-guide', (req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), 'server/public/SavviWell-5-Day-Meals.pdf');
    res.download(filePath, 'SavviWell-5-Day-Meals.pdf', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
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

      // Send meal guide email to user
      try {
        await sendMealGuideEmail({
          to: validatedData.email,
          name: validatedData.name,
          accessToken: newEntry.accessToken || ''
        });
        console.log(`Meal guide email sent to ${validatedData.email}`);
      } catch (error) {
        console.error('Error sending meal guide email:', error);
        // Don't fail the request if email fails
      }

      // Send email notification to admin
      try {
        await sendContactEmail({
          to: "savviwell@gmail.com",
          subject: "New Waitlist Signup - SavviWell",
          html: `
            <h2>New Waitlist Signup</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>User Type:</strong> ${validatedData.userType}</p>
            <p><strong>Health Goal:</strong> ${validatedData.healthGoal}</p>
            <p><strong>Dietary Concern:</strong> ${validatedData.dietaryConcern}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
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

      // Return success response
      return res.status(201).json({
        message: "Successfully joined the waitlist",
        id: newEntry.id
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

  // Get all waitlist entries (would normally be protected)
  app.get("/api/waitlist", async (req: Request, res: Response) => {
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
          email: validatedData.email,
          name: validatedData.name || '',
          userType: validatedData.userType,
          healthGoal: validatedData.healthGoal,
          dietaryConcern: validatedData.dietaryConcern,
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

  // Get all newsletter subscribers (for admin)
  app.get("/api/newsletter", async (req: Request, res: Response) => {
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
        to: "admin@savviwell.com",
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

  // Get all contact submissions (for admin)
  app.get("/api/contact", async (req: Request, res: Response) => {
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
        await storage.createWaitlistEntry(entry);
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

  const httpServer = createServer(app);

  return httpServer;
}