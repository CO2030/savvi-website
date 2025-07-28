import { 
  users, type User, type InsertUser,
  waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Waitlist methods
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
  getWaitlistEntryByToken(token: string): Promise<WaitlistEntry | undefined>;
  getAllWaitlistEntries(): Promise<WaitlistEntry[]>;

  // Newsletter methods
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;

  // Contact methods
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const accessToken = this.generateAccessToken();
    const entryWithTimestamp = {
      ...insertEntry,
      accessToken,
      createdAt: new Date().toISOString()
    };
    const result = await db.insert(waitlistEntries).values(entryWithTimestamp).returning();
    return result[0];
  }

  async getWaitlistEntryByToken(token: string): Promise<WaitlistEntry | undefined> {
    const result = await db.select().from(waitlistEntries).where(eq(waitlistEntries.accessToken, token));
    return result[0];
  }

  private generateAccessToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) + 
           Date.now().toString(36);
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    const result = await db.select().from(waitlistEntries).where(eq(waitlistEntries.email, email));
    return result[0];
  }

  async getAllWaitlistEntries(): Promise<WaitlistEntry[]> {
    return await db.select().from(waitlistEntries);
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const subscriberWithTimestamp = {
      ...subscriber,
      createdAt: new Date().toISOString()
    };
    const result = await db.insert(newsletterSubscribers).values(subscriberWithTimestamp).returning();
    return result[0];
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const result = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return result[0];
  }

  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers);
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const submissionWithTimestamp = {
      ...insertSubmission,
      createdAt: new Date().toISOString()
    };
    const result = await db.insert(contactSubmissions).values(submissionWithTimestamp).returning();
    return result[0];
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions);
  }

  async deleteWaitlistEntry(id: number): Promise<void> {
    await db.delete(waitlistEntries).where(eq(waitlistEntries.id, id));
  }

  async deleteContactSubmission(id: number): Promise<void> {
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  }
}

export const storage = new DatabaseStorage();