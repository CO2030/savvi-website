import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  userType: text("user_type").notNull(),
  healthGoal: text("health_goal").notNull(),
  dietaryConcern: text("dietary_concern").notNull(),
  source: text("source"),
  accessToken: text("access_token").unique(),
  createdAt: text("created_at").notNull()
});

export const insertWaitlistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  userType: z.enum(["individual", "parent", "caregiver", "older-adult"]),
  healthGoal: z.enum(["energy", "gut-health", "blood-sugar", "weight-loss", "other"]),
  dietaryConcern: z.enum(["gluten-free", "vegan", "low-sugar", "none"]),
  source: z.string().optional(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  source: text("source"),
  createdAt: text("created_at").notNull()
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  reason: text("reason").notNull(),
  message: text("message"),
  source: text("source"),
  createdAt: text("created_at").notNull()
});

export const insertNewsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  source: z.string().optional(),
});

export const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  reason: z.string().min(1, "Please select a reason for contacting us"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
  source: z.string().optional(),
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;