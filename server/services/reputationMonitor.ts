import { EmailBounceHandler } from './bounceHandler';

interface EmailMetrics {
  sent: number;
  delivered: number;
  bounced: number;
  complaints: number;
  opens: number;
  clicks: number;
  date: Date;
}

export class EmailReputationMonitor {
  private static metrics: EmailMetrics[] = [];

  // Log email sending event
  static logEmailSent(delivered: boolean = true) {
    const today = new Date().toDateString();
    let todayMetrics = this.metrics.find(m => m.date.toDateString() === today);
    
    if (!todayMetrics) {
      todayMetrics = {
        sent: 0,
        delivered: 0,
        bounced: 0,
        complaints: 0,
        opens: 0,
        clicks: 0,
        date: new Date()
      };
      this.metrics.push(todayMetrics);
    }
    
    todayMetrics.sent++;
    if (delivered) todayMetrics.delivered++;
  }

  // Log bounce event
  static logBounce() {
    const today = new Date().toDateString();
    const todayMetrics = this.metrics.find(m => m.date.toDateString() === today);
    if (todayMetrics) {
      todayMetrics.bounced++;
    }
  }

  // Get reputation score (0-100)
  static getReputationScore(): number {
    const recentMetrics = this.metrics.filter(
      m => m.date.getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000) // Last 7 days
    );
    
    if (recentMetrics.length === 0) return 100; // No data = perfect score
    
    const totals = recentMetrics.reduce((acc, m) => ({
      sent: acc.sent + m.sent,
      delivered: acc.delivered + m.delivered,
      bounced: acc.bounced + m.bounced,
      complaints: acc.complaints + m.complaints
    }), { sent: 0, delivered: 0, bounced: 0, complaints: 0 });
    
    if (totals.sent === 0) return 100;
    
    const deliveryRate = totals.delivered / totals.sent;
    const bounceRate = totals.bounced / totals.sent;
    const complaintRate = totals.complaints / totals.sent;
    
    // Calculate score (100 = perfect)
    let score = 100;
    score -= bounceRate * 200; // Bounces heavily penalized
    score -= complaintRate * 500; // Complaints very heavily penalized
    score = score * deliveryRate; // Scale by delivery rate
    
    return Math.max(0, Math.min(100, score));
  }

  // Get weekly reputation report
  static getWeeklyReport() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyMetrics = this.metrics.filter(m => m.date >= weekAgo);
    const totals = weeklyMetrics.reduce((acc, m) => ({
      sent: acc.sent + m.sent,
      delivered: acc.delivered + m.delivered,
      bounced: acc.bounced + m.bounced,
      complaints: acc.complaints + m.complaints
    }), { sent: 0, delivered: 0, bounced: 0, complaints: 0 });
    
    const bounceStats = EmailBounceHandler.getBounceStats();
    
    return {
      period: '7 days',
      reputationScore: this.getReputationScore(),
      totalSent: totals.sent,
      deliveryRate: totals.sent > 0 ? (totals.delivered / totals.sent * 100).toFixed(2) + '%' : 'N/A',
      bounceRate: totals.sent > 0 ? (totals.bounced / totals.sent * 100).toFixed(2) + '%' : 'N/A',
      complaintRate: totals.sent > 0 ? (totals.complaints / totals.sent * 100).toFixed(2) + '%' : 'N/A',
      bounceDetails: bounceStats,
      recommendations: this.getRecommendations(this.getReputationScore(), totals)
    };
  }

  // Get improvement recommendations
  private static getRecommendations(score: number, totals: any): string[] {
    const recommendations: string[] = [];
    
    if (score < 70) {
      recommendations.push('🚨 Reputation score is low - immediate action needed');
    }
    
    if (totals.sent > 0 && totals.bounced / totals.sent > 0.05) {
      recommendations.push('📧 Bounce rate is high - clean your email list');
    }
    
    if (totals.sent > 0 && totals.complaints / totals.sent > 0.001) {
      recommendations.push('⚠️ Complaint rate is high - review email content');
    }
    
    if (totals.sent > 100) {
      recommendations.push('📈 Consider implementing email authentication (SPF/DKIM/DMARC)');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ Email reputation is healthy - keep monitoring');
    }
    
    return recommendations;
  }
}