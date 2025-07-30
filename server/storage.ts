import { 
  users, type User, type InsertUser,
  waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission,
  referralCampaigns, type ReferralCampaign, type InsertReferralCampaign,
  referrals, type Referral, type InsertReferral,
  referralAchievements, type ReferralAchievement
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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

  // Referral methods
  createReferralCampaign(campaign: InsertReferralCampaign): Promise<ReferralCampaign>;
  getAllReferralCampaigns(): Promise<ReferralCampaign[]>;
  getActiveCampaign(): Promise<ReferralCampaign | undefined>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  getAllReferrals(): Promise<Referral[]>;
  getReferralsByReferrer(email: string): Promise<Referral[]>;
  markReferralAsSignedUp(referredEmail: string): Promise<void>;
  checkAndCreateAchievement(referrerEmail: string, campaignId: number): Promise<ReferralAchievement | null>;
  getAllAchievements(): Promise<ReferralAchievement[]>;
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

  // Referral Campaign Methods
  async createReferralCampaign(insertCampaign: InsertReferralCampaign): Promise<ReferralCampaign> {
    const campaignWithTimestamp = {
      ...insertCampaign,
      createdAt: new Date().toISOString()
    };
    const result = await db.insert(referralCampaigns).values(campaignWithTimestamp).returning();
    return result[0];
  }

  async getAllReferralCampaigns(): Promise<ReferralCampaign[]> {
    return await db.select().from(referralCampaigns);
  }

  async getActiveCampaign(): Promise<ReferralCampaign | undefined> {
    const result = await db.select().from(referralCampaigns).where(eq(referralCampaigns.active, true));
    return result[0];
  }

  // Referral Methods
  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const referralWithTimestamp = {
      ...insertReferral,
      createdAt: new Date().toISOString()
    };
    const result = await db.insert(referrals).values(referralWithTimestamp).returning();
    return result[0];
  }

  async getAllReferrals(): Promise<Referral[]> {
    return await db.select().from(referrals);
  }

  async getReferralsByReferrer(email: string): Promise<Referral[]> {
    return await db.select().from(referrals).where(eq(referrals.referrerEmail, email));
  }

  async markReferralAsSignedUp(referredEmail: string): Promise<void> {
    await db.update(referrals)
      .set({ signupCompleted: true })
      .where(eq(referrals.referredEmail, referredEmail));
  }

  async checkAndCreateAchievement(referrerEmail: string, campaignId: number): Promise<ReferralAchievement | null> {
    // Get all completed referrals for this referrer in this campaign
    const completedReferrals = await db.select()
      .from(referrals)
      .where(and(
        eq(referrals.referrerEmail, referrerEmail),
        eq(referrals.campaignId, campaignId),
        eq(referrals.signupCompleted, true)
      ));

    // Get campaign requirements
    const campaign = await db.select()
      .from(referralCampaigns)
      .where(eq(referralCampaigns.id, campaignId));

    if (!campaign[0]) return null;

    // Check if they've met the requirement
    if (completedReferrals.length >= campaign[0].requiredreferrals) {
      // Check if achievement already exists
      const existing = await db.select()
        .from(referralAchievements)
        .where(and(
          eq(referralAchievements.referrerEmail, referrerEmail),
          eq(referralAchievements.campaignId, campaignId)
        ));

      if (existing.length === 0) {
        // Check if we haven't exceeded max participants
        const totalAchievements = await db.select()
          .from(referralAchievements)
          .where(eq(referralAchievements.campaignId, campaignId));

        if (totalAchievements.length < campaign[0].maxparticipants) {
          // Create achievement
          const firstReferral = await db.select()
            .from(referrals)
            .where(eq(referrals.referrerEmail, referrerEmail))
            .limit(1);

          const achievement = {
            campaignId,
            referrerName: firstReferral[0]?.referrerName || 'Unknown',
            referrerEmail,
            completedAt: new Date().toISOString(),
            specialListStatus: 'qualified'
          };

          const result = await db.insert(referralAchievements).values(achievement).returning();
          return result[0];
        }
      }
    }
    return null;
  }

  async getAllAchievements(): Promise<ReferralAchievement[]> {
    return await db.select().from(referralAchievements);
  }
}

export const storage = new DatabaseStorage();