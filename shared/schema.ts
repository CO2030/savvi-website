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

// Referral System Tables
export const referralCampaigns = pgTable("referral_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  requiredreferrals: integer("required_referrals").notNull(),
  maxparticipants: integer("max_participants").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: text("created_at").notNull()
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => referralCampaigns.id),
  referrerName: text("referrer_name").notNull(),
  referrerEmail: text("referrer_email").notNull(),
  referredName: text("referred_name").notNull(),
  referredEmail: text("referred_email").notNull(),
  signupCompleted: boolean("signup_completed").notNull().default(false),
  source: text("source"),
  createdAt: text("created_at").notNull()
});

export const referralAchievements = pgTable("referral_achievements", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => referralCampaigns.id),
  referrerName: text("referrer_name").notNull(),
  referrerEmail: text("referrer_email").notNull(),
  completedAt: text("completed_at").notNull(),
  specialListStatus: text("special_list_status").notNull().default("qualified")
});

// Referral Schemas
export const insertReferralCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().min(1, "Description is required"),
  requiredreferrals: z.number().min(1, "Must require at least 1 referral"),
  maxparticipants: z.number().min(1, "Must allow at least 1 participant"),
  active: z.boolean().default(true)
});

export const insertReferralSchema = z.object({
  campaignId: z.number().optional(),
  referrerName: z.string().min(1, "Your name is required"),
  referrerEmail: z.string().email("Valid email is required"),
  referredName: z.string().min(1, "Friend's name is required"),
  referredEmail: z.string().email("Friend's valid email is required"),
  source: z.string().optional()
});

// Types
export type InsertReferralCampaign = z.infer<typeof insertReferralCampaignSchema>;
export type ReferralCampaign = typeof referralCampaigns.$inferSelect;

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;

export type ReferralAchievement = typeof referralAchievements.$inferSelect;