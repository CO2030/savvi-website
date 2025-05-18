import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertNewsletterSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { submitToGoogleScript } from "./services/googleScripts";
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
      
      // Create newsletter subscription in local storage
      const newSubscriber = await storage.createNewsletterSubscriber(validatedData);
      
      // Try to submit to Google Sheet if URL is provided
      if (config.googleScriptDeploymentUrl) {
        try {
          await submitToGoogleScript(config.googleScriptDeploymentUrl, {
            email: validatedData.email,
            name: "Newsletter Subscriber",
            userType: "newsletter",
            healthGoal: "n/a", 
            dietaryConcern: "n/a",
            source: "newsletter"
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.error("Google Sheet submission failed:", errorMessage);
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

  const httpServer = createServer(app);

  return httpServer;
}
