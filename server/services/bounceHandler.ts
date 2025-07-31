import { storage } from '../storage';

interface BounceEvent {
  email: string;
  bounceType: 'hard' | 'soft';
  reason: string;
  timestamp: Date;
}

export class EmailBounceHandler {
  private static bounceLog: BounceEvent[] = [];

  // Log bounce events
  static async logBounce(email: string, bounceType: 'hard' | 'soft', reason: string) {
    const bounceEvent: BounceEvent = {
      email,
      bounceType,
      reason,
      timestamp: new Date()
    };
    
    this.bounceLog.push(bounceEvent);
    console.log(`📧 Bounce logged: ${email} (${bounceType}) - ${reason}`);
    
    // Handle hard bounces immediately
    if (bounceType === 'hard') {
      await this.handleHardBounce(email);
    }
    
    // Monitor bounce rates
    await this.checkBounceRates();
  }

  // Handle hard bounces (invalid emails)
  private static async handleHardBounce(email: string) {
    try {
      // In production, you'd mark the email as invalid in your database
      console.log(`⚠️ Hard bounce detected for ${email} - should be marked as invalid`);
      
      // Could implement:
      // await storage.markEmailAsInvalid(email);
      
    } catch (error) {
      console.error('Error handling hard bounce:', error);
    }
  }

  // Monitor overall bounce rates
  private static async checkBounceRates() {
    const recentBounces = this.bounceLog.filter(
      bounce => bounce.timestamp.getTime() > Date.now() - (24 * 60 * 60 * 1000) // Last 24 hours
    );
    
    const hardBounces = recentBounces.filter(b => b.bounceType === 'hard').length;
    const totalEmails = recentBounces.length; // This should come from email sending logs
    
    if (totalEmails > 10 && hardBounces / totalEmails > 0.05) { // 5% hard bounce rate
      console.log(`🚨 HIGH BOUNCE RATE ALERT: ${(hardBounces/totalEmails*100).toFixed(1)}% hard bounce rate`);
      // In production, send alert email to admin
    }
  }

  // Get bounce statistics
  static getBounceStats() {
    const recentBounces = this.bounceLog.filter(
      bounce => bounce.timestamp.getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000) // Last 7 days
    );
    
    return {
      totalBounces: recentBounces.length,
      hardBounces: recentBounces.filter(b => b.bounceType === 'hard').length,
      softBounces: recentBounces.filter(b => b.bounceType === 'soft').length,
      bounceRate: recentBounces.length > 0 ? (recentBounces.length / 100 * 100).toFixed(2) + '%' : '0%'
    };
  }
}

// Email validation to prevent bounces
export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check for disposable email domains
const DISPOSABLE_DOMAINS = [
  '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
  'mailinator.com', 'yopmail.com', 'temp-mail.org'
];

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}