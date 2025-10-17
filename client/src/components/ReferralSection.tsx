import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Share2, Users, Gift, CheckCircle, Clock, Star } from "lucide-react";
import { ReferralCampaign, Referral } from "@shared/schema";

interface ReferralSectionProps {
  userEmail: string;
  userName: string;
}

export function ReferralSection({ userEmail, userName }: ReferralSectionProps) {
  const [campaign, setCampaign] = useState<ReferralCampaign | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [completedReferrals, setCompletedReferrals] = useState(0);
  const [requiredReferrals, setRequiredReferrals] = useState(0);
  const [qualified, setQualified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [referredName, setReferredName] = useState("");
  const [referredEmail, setReferredEmail] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    loadCampaignAndProgress();
  }, [userEmail]);

  const loadCampaignAndProgress = async () => {
    try {
      setIsLoading(true);
      
      // Load active campaign
      const campaignResponse = await apiRequest("GET", "/api/referral/campaign");
      setCampaign(campaignResponse);
      
      if (campaignResponse) {
        // Load user's progress
        const progressResponse = await apiRequest("GET", `/api/referral/progress/${encodeURIComponent(userEmail)}`);
        setReferrals(progressResponse.referrals || []);
        setCompletedReferrals(progressResponse.completedReferrals || 0);
        setRequiredReferrals(progressResponse.requiredReferrals || 0);
        setQualified(progressResponse.qualified || false);
      }
    } catch (error) {
      console.error("Error loading referral data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referredName || !referredEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in both name and email",
        variant: "destructive"
      });
      return;
    }

    if (referredEmail === userEmail) {
      toast({
        title: "Invalid referral",
        description: "You cannot refer yourself",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/referral", {
        referrerName: userName,
        referrerEmail: userEmail,
        referredName,
        referredEmail,
        source: "meal-guide-referral"
      });

      toast({
        title: "Referral sent!",
        description: `${referredName} has been added to your referral list. They'll need to sign up for the waitlist to complete the referral.`
      });

      // Clear form
      setReferredName("");
      setReferredEmail("");
      
      // Reload progress
      await loadCampaignAndProgress();
      
    } catch (error: any) {
      toast({
        title: "Error sending referral",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/3-day-meals?ref=${encodeURIComponent(userEmail)}&referrer=${encodeURIComponent(userName)}`;
  };

  const copyShareUrl = () => {
    const shareUrl = generateShareUrl();
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Share this link with your friends"
    });
  };

  const shareOnSocial = (platform: string) => {
    const shareUrl = generateShareUrl();
    const text = `Check out this amazing 3-Day Meals Guide from SavviWell! 🥗 It's helping me plan healthier meals. Get yours here:`;
    
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            <span>Loading referral program...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!campaign) {
    return null; // No active campaign
  }

  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Gift className="h-6 w-6 text-orange-600" />
          <CardTitle className="text-2xl text-orange-800">🎉 Special Offer!</CardTitle>
          <Gift className="h-6 w-6 text-orange-600" />
        </div>
        <p className="text-lg font-semibold text-orange-700">{campaign.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Display */}
        <div className="bg-white/70 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-700">Your Progress</span>
            {qualified && (
              <Badge className="bg-green-600 text-white">
                <Star className="h-3 w-3 mr-1" />
                Qualified!
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((completedReferrals / requiredReferrals) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {completedReferrals} / {requiredReferrals}
            </span>
          </div>
          
          <p className="text-sm text-gray-600">
            {qualified 
              ? "🎉 Congratulations! You've qualified for early access!" 
              : `${requiredReferrals - completedReferrals} more friends needed for early access`
            }
          </p>
        </div>

        {/* Referral Form */}
        <div className="bg-white/70 rounded-lg p-4 border border-orange-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Refer a Friend
          </h3>
          
          <form onSubmit={handleReferralSubmit} className="space-y-3">
            <div>
              <Label htmlFor="referredName">Friend's Name</Label>
              <Input
                id="referredName"
                value={referredName}
                onChange={(e) => setReferredName(e.target.value)}
                placeholder="Enter your friend's name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="referredEmail">Friend's Email</Label>
              <Input
                id="referredEmail"
                type="email"
                value={referredEmail}
                onChange={(e) => setReferredEmail(e.target.value)}
                placeholder="Enter your friend's email"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Referral"}
            </Button>
          </form>
        </div>

        {/* Social Sharing */}
        <div className="bg-white/70 rounded-lg p-4 border border-orange-200">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            Share with Friends
          </h3>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button 
              onClick={() => shareOnSocial("facebook")}
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Facebook
            </Button>
            <Button 
              onClick={() => shareOnSocial("twitter")}
              variant="outline"
              size="sm"
              className="text-blue-500 border-blue-200 hover:bg-blue-50"
            >
              Twitter
            </Button>
            <Button 
              onClick={() => shareOnSocial("linkedin")}
              variant="outline"
              size="sm"
              className="text-blue-700 border-blue-200 hover:bg-blue-50"
            >
              LinkedIn
            </Button>
            <Button 
              onClick={copyShareUrl}
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              Copy Link
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            Share your unique link: <code className="bg-gray-100 px-1 rounded text-xs">{generateShareUrl()}</code>
          </p>
        </div>

        {/* Referral List */}
        {referrals.length > 0 && (
          <div className="bg-white/70 rounded-lg p-4 border border-orange-200">
            <h3 className="font-semibold text-gray-800 mb-3">Your Referrals</h3>
            <div className="space-y-2">
              {referrals.map((referral, index) => (
                <div key={referral.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <span className="font-medium text-sm">{referral.referredName}</span>
                    <span className="text-gray-500 text-xs ml-2">{referral.referredEmail}</span>
                  </div>
                  <div className="flex items-center">
                    {referral.signupCompleted ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}