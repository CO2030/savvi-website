import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertNewsletterSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { submitToGoogleScript } from "./services/googleScripts";
import { sendContactEmail } from "./services/emailService";
import { config } from "./config";

export async function registerRoutes(app: Express): Promise<Server> {
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

      // Get Google Script deployment URL from config
      const deploymentUrl = config.googleScriptDeploymentUrl;

      // Submit to Google Sheet if deployment URL is available
      if (deploymentUrl) {
        const googleSubmitResult = await submitToGoogleScript(deploymentUrl, {
          name: validatedData.name,
          email: validatedData.email,
          userType: validatedData.userType,
          healthGoal: validatedData.healthGoal,
          dietaryConcern: validatedData.dietaryConcern
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
      //const deploymentUrl = config.googleScriptDeploymentUrl;
      //if (deploymentUrl) {
      //  const googleSubmitResult = await submitNewsletterToGoogleScript(deploymentUrl, {
      //    email: validatedData.email,
      //    name: validatedData.name
      //  });

      //  if (!googleSubmitResult.success) {
      //    console.warn("Google Sheet newsletter submission failed:", googleSubmitResult.message);
      //    // Continue with database storage only
      //  }
      //}

      // Create newsletter subscriber in database
      const newSubscriber = await storage.createNewsletterSubscriber(validatedData);

      // Send email notification immediately
      // await sendNewsletterNotification({
      //   email: validatedData.email,
      //   name: validatedData.name
      // });

      // Submit to Google Sheet if deployment URL is available
      //const deploymentUrl = config.googleScriptDeploymentUrl;
      //if (deploymentUrl) {
      //  const googleSubmitResult = await submitNewsletterToGoogleScript(deploymentUrl, {
      //    email: validatedData.email,
      //    name: validatedData.name
      //  });

      //  if (!googleSubmitResult.success) {
      //    console.warn("Google Sheet newsletter submission failed:", googleSubmitResult.message);
      //    // Continue with database storage only
      //  }
      //}

      // Create newsletter subscriber in database
      const newSubscriber = await storage.createNewsletterSubscriber(validatedData);

      // Send email notification immediately
      // await sendNewsletterNotification({
      //   email: validatedData.email,
      //   name: validatedData.name
      // });

      // Submit to Google Sheet if deployment URL is available
      //const deploymentUrl = config.googleScriptDeploymentUrl;
      //if (deploymentUrl) {
      //  const googleSubmitResult = await submitNewsletterToGoogleScript(deploymentUrl, {
      //    email: validatedData.email,
      //    name: validatedData.name
      //  });

      //  if (!googleSubmitResult.success) {
      //    console.warn("Google Sheet newsletter submission failed:", googleSubmitResult.message);
      //    // Continue with database storage only
      //  }
      //}

      // Create newsletter subscriber in database
      const newSubscriber = await storage.createNewsletterSubscriber(validatedData);

      // Send email notification immediately
      // await sendNewsletterNotification({
      //   email: validatedData.email,
      //   name: validatedData.name
      // });

      // Submit to Google Sheet if deployment URL is available
      //const deploymentUrl = config.googleScriptDeploymentUrl;
      //if (deploymentUrl) {
      //  const googleSubmitResult = await submitNewsletterToGoogleScript(deploymentUrl, {
      //    email: validatedData.email,
      //    name: validatedData.name
      //  });

      //  if (!googleSubmitResult.success) {
      //    console.warn("Google Sheet newsletter submission failed:", googleSubmitResult.message);
      //    // Continue with database storage only
      //  }
      //}
      
      // Create newsletter subscriber in database
      const newSubscriber = await storage.createNewsletterSubscriber(validatedData);

      // Send email notification immediately
      // await sendNewsletterNotification({
      //   email: validatedData.email,
      //   name: validatedData.name
      // });

      // Submit to Google Sheet if deployment URL is available
      //const deploymentUrl = config.googleScriptDeploymentUrl;
      //if (deploymentUrl) {
      //  const googleSubmitResult = await submitNewsletterToGoogleScript(deploymentUrl, {
      //    email: validatedData.email,
      //    name: validatedData.name
      //  });

      //  if (!googleSubmitResult.success) {
      //    console.warn("Google Sheet newsletter submission failed:", googleSubmitResult.message);
      //    // Continue with database storage only
      //  }
      //}

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
        name: validatedData.name,
        email: validatedData.email,
        reason: validatedData.reason,
        message: validatedData.message
      });

      // Submit to Google Sheet if deployment URL is available
      const deploymentUrl = config.googleScriptDeploymentUrl;
      if (deploymentUrl) {
        const googleSubmitResult = await submitContactToGoogleScript(deploymentUrl, {
          name: validatedData.name,
          email: validatedData.email,
          reason: validatedData.reason,
          message: validatedData.message
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

  // Test endpoint to add sample data (for testing the admin dashboard grouping)
  app.post("/api/test/add-sample-data", async (req: Request, res: Response) => {
    try {
      // Sample waitlist entries with different user types and health goals
      const sampleWaitlistEntries = [
        {
          name: "Alice Johnson",
          email: "alice@example.com",
          userType: "Individual",
          healthGoal: "Weight Loss",
          dietaryConcern: "Gluten-free diet"
        },
        {
          name: "Bob Smith",
          email: "bob@example.com",
          userType: "Individual",
          healthGoal: "Weight Loss",
          dietaryConcern: "Low-carb preferences"
        },
        {
          name: "Carol Williams",
          email: "carol@example.com",
          userType: "Healthcare Professional",
          healthGoal: "Patient Education",
          dietaryConcern: "Diabetes management"
        },
        {
          name: "David Brown",
          email: "david@example.com",
          userType: "Individual",
          healthGoal: "Muscle Gain",
          dietaryConcern: "High-protein diet"
        },
        {
          name: "Emma Davis",
          email: "emma@example.com",
          userType: "Nutritionist",
          healthGoal: "Client Support",
          dietaryConcern: "Food allergies"
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

      // Add waitlist entries
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