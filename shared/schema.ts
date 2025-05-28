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
  createdAt: text("created_at").notNull()
});

export const insertWaitlistSchema = createInsertSchema(waitlistEntries).omit({
  id: true,
  createdAt: true
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").notNull()
});

export const insertNewsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  reason: z.string().min(1, "Please select a reason for contacting us"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;