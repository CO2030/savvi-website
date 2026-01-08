import { 
  users, type User, type InsertUser,
  waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber,
  contactSubmissions, type ContactSubmission, type InsertContactSubmission,
  referralCampaigns, type ReferralCampaign, type InsertReferralCampaign,
  referrals, type Referral, type InsertReferral,
  referralAchievements, type ReferralAchievement,
  shareEvents, type ShareEvent, type InsertShareEvent
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

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

  // Share tracking methods
  createShareEvent(shareEvent: InsertShareEvent): Promise<ShareEvent>;
  getShareEventsByEmail(email: string): Promise<ShareEvent[]>;
  getAllShareEvents(): Promise<ShareEvent[]>;
  getShareAnalytics(): Promise<any>;
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



  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    const result = await db.select().from(waitlistEntries).where(eq(waitlistEntries.email, email));
    return result[0];
  }

  async getAllWaitlistEntries(): Promise<WaitlistEntry[]> {
    return await db.select().from(waitlistEntries).orderBy(desc(waitlistEntries.createdAt));
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

  async unsubscribeUser(token: string): Promise<WaitlistEntry | null> {
    const [updated] = await db
      .update(waitlistEntries)
      .set({ 
        isUnsubscribed: true, 
        unsubscribedAt: new Date().toISOString() 
      })
      .where(eq(waitlistEntries.accessToken, token))
      .returning();
    return updated || null;
  }

  async getUnsubscribeAnalytics(): Promise<{
    totalUnsubscribed: number;
    totalActive: number;
    monthlyData: Array<{
      month: string;
      unsubscribed: number;
      active: number;
      signups: number;
      unsubscribeRate: string;
    }>;
  }> {
    const allEntries = await db.select().from(waitlistEntries);
    
    const totalUnsubscribed = allEntries.filter(entry => entry.isUnsubscribed).length;
    const totalActive = allEntries.filter(entry => !entry.isUnsubscribed).length;
    
    // Group by month for last 12 months
    const monthlyData = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = date.toISOString().substring(0, 7); // YYYY-MM format
      
      // Count entries created in this month
      const monthlySignups = allEntries.filter(entry => 
        entry.createdAt.startsWith(monthStart)
      );
      
      // Count unsubscribes in this month
      const monthlyUnsubscribes = allEntries.filter(entry => 
        entry.isUnsubscribed && 
        entry.unsubscribedAt && 
        entry.unsubscribedAt.startsWith(monthStart)
      );
      
      // Count currently active users from this month's signups
      const activeFromMonth = monthlySignups.filter(entry => !entry.isUnsubscribed).length;
      
      const signups = monthlySignups.length;
      const unsubscribed = monthlyUnsubscribes.length;
      
      monthlyData.push({
        month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        unsubscribed,
        active: activeFromMonth,
        signups,
        unsubscribeRate: signups > 0 ? ((unsubscribed / signups) * 100).toFixed(1) + '%' : '0%'
      });
    }
    
    return {
      totalUnsubscribed,
      totalActive,
      monthlyData
    };
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

  // Share tracking methods implementation
  async createShareEvent(insertShareEvent: InsertShareEvent): Promise<ShareEvent> {
    const shareEventWithTimestamp = {
      ...insertShareEvent,
      createdAt: new Date().toISOString()
    };
    const result = await db.insert(shareEvents).values(shareEventWithTimestamp).returning();
    return result[0];
  }

  async getShareEventsByEmail(email: string): Promise<ShareEvent[]> {
    return await db.select().from(shareEvents).where(eq(shareEvents.sharerEmail, email));
  }

  async getAllShareEvents(): Promise<ShareEvent[]> {
    return await db.select().from(shareEvents);
  }

  async getShareAnalytics(): Promise<any> {
    const allShares = await this.getAllShareEvents();
    const allWaitlist = await this.getAllWaitlistEntries();
    
    const shareStats = {
      totalShares: allShares.length,
      sharesByPlatform: allShares.reduce((acc, share) => {
        acc[share.platform] = (acc[share.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      topSharers: allShares.reduce((acc, share) => {
        const key = `${share.sharerName} (${share.sharerEmail})`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      conversionTracking: {
        totalSharedUsers: new Set(allShares.map(s => s.sharerEmail)).size,
        signupsFromShares: allWaitlist.filter(w => 
          w.source?.includes('shared') || w.source?.includes('referral')
        ).length
      }
    };
    
    return shareStats;
  }

  private generateAccessToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');
  }
}

export const storage = new DatabaseStorage();