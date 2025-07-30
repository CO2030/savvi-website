import { storage } from "./storage";

async function initializeReferralCampaign() {
  try {
    // Check if there's already an active campaign
    const existing = await storage.getActiveCampaign();
    
    if (!existing) {
      // Create the first campaign
      const campaign = await storage.createReferralCampaign({
        name: "Early Access Founders",
        description: "First 100 people who refer 3 friends will get free early access to wellness tool",
        requiredreferrals: 3,
        active: true,
        maxqualifiers: 100
      });
      
      console.log('✅ Created initial referral campaign:', campaign);
    } else {
      console.log('✅ Referral campaign already exists:', existing.name);
    }
  } catch (error) {
    console.error('❌ Error initializing referral campaign:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeReferralCampaign().then(() => process.exit(0));
}

export { initializeReferralCampaign };