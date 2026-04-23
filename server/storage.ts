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
import { db as _db } from "./db";
import { eq, and, desc } from "drizzle-orm";

const db = _db!;

function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), byte =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Waitlist methods
  createWaitlistEntry(entry: InsertWaitlistEntry & { ipAddress?: string }): Promise<WaitlistEntry>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
  getWaitlistEntryByToken(token: string): Promise<WaitlistEntry | undefined>;
  getAllWaitlistEntries(): Promise<WaitlistEntry[]>;

  // Newsletter methods
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber & { ipAddress?: string }): Promise<NewsletterSubscriber>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;

  // Contact methods
  createContactSubmission(submission: InsertContactSubmission & { ipAddress?: string }): Promise<ContactSubmission>;
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

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry & { ipAddress?: string }): Promise<WaitlistEntry> {
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

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber & { ipAddress?: string }): Promise<NewsletterSubscriber> {
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

  async createContactSubmission(insertSubmission: InsertContactSubmission & { ipAddress?: string }): Promise<ContactSubmission> {
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
    return generateToken();
  }
}

export class InMemoryStorage implements IStorage {
  private _users: User[] = [];
  private _waitlist: WaitlistEntry[] = [];
  private _newsletter: NewsletterSubscriber[] = [];
  private _contact: ContactSubmission[] = [];
  private _campaigns: ReferralCampaign[] = [];
  private _referrals: Referral[] = [];
  private _achievements: ReferralAchievement[] = [];
  private _shares: ShareEvent[] = [];
  private ids = { u: 1, w: 1, n: 1, c: 1, camp: 1, ref: 1, ach: 1, sh: 1 };

  async getUser(id: number) { return this._users.find(u => u.id === id); }
  async getUserByUsername(username: string) { return this._users.find(u => u.username === username); }
  async createUser(user: InsertUser): Promise<User> {
    const u = { ...user, id: this.ids.u++ };
    this._users.push(u);
    return u;
  }

  async createWaitlistEntry(entry: InsertWaitlistEntry & { ipAddress?: string }): Promise<WaitlistEntry> {
    const e: WaitlistEntry = {
      id: this.ids.w++,
      name: entry.name,
      email: entry.email,
      userType: entry.userType,
      healthGoal: entry.healthGoal,
      dietaryConcern: entry.dietaryConcern,
      source: entry.source ?? null,
      accessToken: generateToken(),
      isUnsubscribed: false,
      unsubscribedAt: null,
      utmSource: entry.utmSource ?? null,
      utmMedium: entry.utmMedium ?? null,
      utmCampaign: entry.utmCampaign ?? null,
      utmContent: entry.utmContent ?? null,
      utmTerm: entry.utmTerm ?? null,
      referrerUrl: entry.referrerUrl ?? null,
      landingPage: entry.landingPage ?? null,
      deviceType: entry.deviceType ?? null,
      browserName: entry.browserName ?? null,
      ipAddress: entry.ipAddress ?? null,
      createdAt: new Date().toISOString(),
    };
    this._waitlist.push(e);
    return e;
  }
  async getWaitlistEntryByEmail(email: string) { return this._waitlist.find(e => e.email === email); }
  async getWaitlistEntryByToken(token: string) { return this._waitlist.find(e => e.accessToken === token); }
  async getAllWaitlistEntries() { return [...this._waitlist].reverse(); }
  async deleteWaitlistEntry(id: number) { this._waitlist = this._waitlist.filter(e => e.id !== id); }
  async unsubscribeUser(token: string): Promise<WaitlistEntry | null> {
    const e = this._waitlist.find(e => e.accessToken === token);
    if (!e) return null;
    e.isUnsubscribed = true;
    e.unsubscribedAt = new Date().toISOString();
    return e;
  }
  async getUnsubscribeAnalytics() {
    return { totalUnsubscribed: 0, totalActive: this._waitlist.length, monthlyData: [] };
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber & { ipAddress?: string }): Promise<NewsletterSubscriber> {
    const s: NewsletterSubscriber = {
      id: this.ids.n++,
      email: subscriber.email,
      name: subscriber.name ?? null,
      source: subscriber.source ?? null,
      utmSource: subscriber.utmSource ?? null,
      utmMedium: subscriber.utmMedium ?? null,
      utmCampaign: subscriber.utmCampaign ?? null,
      utmContent: subscriber.utmContent ?? null,
      utmTerm: subscriber.utmTerm ?? null,
      referrerUrl: subscriber.referrerUrl ?? null,
      landingPage: subscriber.landingPage ?? null,
      deviceType: subscriber.deviceType ?? null,
      browserName: subscriber.browserName ?? null,
      ipAddress: subscriber.ipAddress ?? null,
      createdAt: new Date().toISOString(),
    };
    this._newsletter.push(s);
    return s;
  }
  async getNewsletterSubscriberByEmail(email: string) { return this._newsletter.find(s => s.email === email); }
  async getAllNewsletterSubscribers() { return [...this._newsletter].reverse(); }

  async createContactSubmission(submission: InsertContactSubmission & { ipAddress?: string }): Promise<ContactSubmission> {
    const c: ContactSubmission = {
      id: this.ids.c++,
      name: submission.name,
      email: submission.email,
      reason: submission.reason,
      message: submission.message ?? null,
      source: submission.source ?? null,
      utmSource: submission.utmSource ?? null,
      utmMedium: submission.utmMedium ?? null,
      utmCampaign: submission.utmCampaign ?? null,
      utmContent: submission.utmContent ?? null,
      utmTerm: submission.utmTerm ?? null,
      referrerUrl: submission.referrerUrl ?? null,
      landingPage: submission.landingPage ?? null,
      deviceType: submission.deviceType ?? null,
      browserName: submission.browserName ?? null,
      ipAddress: submission.ipAddress ?? null,
      createdAt: new Date().toISOString(),
    };
    this._contact.push(c);
    return c;
  }
  async getAllContactSubmissions() { return [...this._contact].reverse(); }
  async deleteContactSubmission(id: number) { this._contact = this._contact.filter(c => c.id !== id); }

  async createReferralCampaign(campaign: InsertReferralCampaign): Promise<ReferralCampaign> {
    const c: ReferralCampaign = { ...campaign, id: this.ids.camp++, createdAt: new Date().toISOString() };
    this._campaigns.push(c);
    return c;
  }
  async getAllReferralCampaigns() { return [...this._campaigns]; }
  async getActiveCampaign() { return this._campaigns.find(c => c.active); }

  async createReferral(referral: InsertReferral): Promise<Referral> {
    const r: Referral = {
      id: this.ids.ref++,
      campaignId: referral.campaignId ?? null,
      referrerName: referral.referrerName,
      referrerEmail: referral.referrerEmail,
      referredName: referral.referredName,
      referredEmail: referral.referredEmail,
      signupCompleted: false,
      source: referral.source ?? null,
      createdAt: new Date().toISOString(),
    };
    this._referrals.push(r);
    return r;
  }
  async getAllReferrals() { return [...this._referrals]; }
  async getReferralsByReferrer(email: string) { return this._referrals.filter(r => r.referrerEmail === email); }
  async markReferralAsSignedUp(referredEmail: string) {
    const r = this._referrals.find(r => r.referredEmail === referredEmail);
    if (r) r.signupCompleted = true;
  }
  async checkAndCreateAchievement(_referrerEmail: string, _campaignId: number): Promise<ReferralAchievement | null> {
    return null;
  }
  async getAllAchievements() { return [...this._achievements]; }

  async createShareEvent(shareEvent: InsertShareEvent): Promise<ShareEvent> {
    const e: ShareEvent = { ...shareEvent, id: this.ids.sh++, createdAt: new Date().toISOString() };
    this._shares.push(e);
    return e;
  }
  async getShareEventsByEmail(email: string) { return this._shares.filter(e => e.sharerEmail === email); }
  async getAllShareEvents() { return [...this._shares]; }
  async getShareAnalytics() {
    return {
      totalShares: this._shares.length,
      sharesByPlatform: {} as Record<string, number>,
      topSharers: {} as Record<string, number>,
      conversionTracking: { totalSharedUsers: 0, signupsFromShares: 0 },
    };
  }
}

export const storage = _db ? new DatabaseStorage() : new InMemoryStorage();