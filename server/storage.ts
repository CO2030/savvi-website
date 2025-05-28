import { 
  users, type User, type InsertUser,
  waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Waitlist methods
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
  getAllWaitlistEntries(): Promise<WaitlistEntry[]>;

  // Newsletter methods
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlistEntries: Map<number, WaitlistEntry>;
  private newsletterSubscribers: Map<number, NewsletterSubscriber>;
  currentUserId: number;
  currentWaitlistId: number;
  currentNewsletterId: number;

  constructor() {
    this.users = new Map();
    this.waitlistEntries = new Map();
    this.newsletterSubscribers = new Map();
    this.currentUserId = 1;
    this.currentWaitlistId = 1;
    this.currentNewsletterId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.currentWaitlistId++;
    const createdAt = new Date().toISOString();
    const entry: WaitlistEntry = { ...insertEntry, id, createdAt };
    this.waitlistEntries.set(id, entry);
    return entry;
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    return Array.from(this.waitlistEntries.values()).find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async getAllWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlistEntries.values());
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = this.currentNewsletterId++;
    const createdAt = new Date().toISOString();

    const newSubscriber: NewsletterSubscriber = { 
      ...subscriber, 
      id, 
      createdAt 
    };

    this.newsletterSubscribers.set(id, newSubscriber);
    return newSubscriber;
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    return Array.from(this.newsletterSubscribers.values()).find(
      (subscriber) => subscriber.email === email
    );
  }

  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values());
  }
}

export const storage = new MemStorage();