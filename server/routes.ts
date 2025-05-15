import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

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
          message: "Email already registered for the waitlist"
        });
      }
      
      // Create waitlist entry
      const newEntry = await storage.createWaitlistEntry(validatedData);
      
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

  const httpServer = createServer(app);

  return httpServer;
}
