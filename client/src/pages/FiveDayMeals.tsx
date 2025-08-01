import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Download, Clock, Users, Utensils, Heart, Share2, Copy } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import confetti from 'canvas-confetti';
import heroImagePath from "@/assets/images/5-day-meals-hero-final.png";

// Analytics and source tracking utilities
const getSourceFromURL = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('source') || urlParams.get('utm_source') || urlParams.get('ref');
  if (source) return source;
  
  // Check referrer
  const referrer = document.referrer;
  if (referrer) {
    if (referrer.includes('facebook.com')) return 'facebook';
    if (referrer.includes('instagram.com')) return 'instagram';
    if (referrer.includes('twitter.com') || referrer.includes('x.com')) return 'twitter';
    if (referrer.includes('linkedin.com')) return 'linkedin';
    if (referrer.includes('youtube.com')) return 'youtube';
    if (referrer.includes('tiktok.com')) return 'tiktok';
    if (referrer.includes('google.com')) return 'google-search';
    if (referrer.includes('bing.com')) return 'bing-search';
    return 'external-website';
  }
  
  return 'direct';
};

// Get referral data from URL
const getReferralFromURL = (): { referrerEmail?: string; referrerName?: string } => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    referrerEmail: urlParams.get('ref') || undefined,
    referrerName: urlParams.get('referrer') || undefined
  };
};

const getCampaignFromURL = (): string | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('utm_campaign') || urlParams.get('campaign') || undefined;
};

const getMediumFromURL = (): string | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('utm_medium') || urlParams.get('medium') || undefined;
};

// Declare gtag type for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Lead magnet specific schema - with dynamic source tracking
const leadMagnetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  userType: z.literal("individual"), // Default for lead magnet
  healthGoal: z.literal("energy"), // Default for 5-day meals
  dietaryConcern: z.literal("none"), // Default
  source: z.string()
});

type LeadMagnetFormData = z.infer<typeof leadMagnetSchema>;

export default function FiveDayMeals() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [sourceData, setSourceData] = useState({
    source: 'direct',
    campaign: undefined as string | undefined,
    medium: undefined as string | undefined
  });
  const [referralData, setReferralData] = useState<{
    referrerEmail?: string;
    referrerName?: string;
  }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Capture source and referral tracking on component mount
  useEffect(() => {
    const source = getSourceFromURL();
    const campaign = getCampaignFromURL();
    const medium = getMediumFromURL();
    const referral = getReferralFromURL();
    
    setSourceData({ source, campaign, medium });
    setReferralData(referral);
    
    // Store in localStorage for analytics
    localStorage.setItem('user_source', source);
    if (campaign) localStorage.setItem('user_campaign', campaign);
    if (medium) localStorage.setItem('user_medium', medium);
    
    // Track page view with source attribution in Google Analytics
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'waitlist_page_view', {
        page_title: '5-Day Healthy Meals - Lead Magnet',
        page_location: window.location.href,
        source_attribution: source,
        campaign_attribution: campaign || 'none',
        medium_attribution: medium || 'none',
        event_category: 'lead_magnet',
        event_label: 'page_entry'
      });
      
      // Track unique page view with source
      window.gtag('event', 'page_view', {
        page_title: '5-Day Healthy Meals - Lead Magnet',
        page_location: window.location.href,
        custom_parameter_source: source,
        custom_parameter_campaign: campaign || 'none',
        custom_parameter_medium: medium || 'none'
      });
    }
  }, []);

  const form = useForm<LeadMagnetFormData>({
    defaultValues: {
      name: "",
      email: "",
      userType: "individual",
      healthGoal: "energy",
      dietaryConcern: "none",
      source: "5-day-lead-magnet"
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: LeadMagnetFormData) => {
      const response = await apiRequest("POST", "/api/waitlist", data);
      return response;
    },
    onSuccess: async (response: any) => {
      setIsSubmitted(true);
      setAccessToken(response.accessToken || "");
      
      // Track conversion in Google Analytics with enhanced attribution
      if (typeof window !== 'undefined' && (window as any).trackFormSubmission) {
        (window as any).trackFormSubmission('lead_magnet', sourceData.source);
      }
      
      // Additional detailed conversion tracking
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'lead_magnet_conversion', {
          event_category: 'conversion',
          event_label: 'waitlist_signup',
          source_attribution: sourceData.source,
          campaign_attribution: sourceData.campaign || 'none',
          medium_attribution: sourceData.medium || 'none',
          conversion_value: 1,
          currency: 'USD'
        });
        
        // Track as purchase/conversion for ecommerce
        window.gtag('event', 'purchase', {
          transaction_id: Date.now().toString(),
          value: 1,
          currency: 'USD',
          items: [{
            item_id: 'lead_magnet_5_day_meals',
            item_name: '5-Day Healthy Meals Guide',
            item_category: 'lead_magnet',
            quantity: 1,
            price: 1
          }],
          source_attribution: sourceData.source,
          campaign_attribution: sourceData.campaign || 'none'
        });
      }
      
      // Submit referral if this was a referred signup
      if (referralData.referrerEmail && referralData.referrerName) {
        try {
          await apiRequest("POST", "/api/referral", {
            referrerName: referralData.referrerName,
            referrerEmail: referralData.referrerEmail,
            referredName: response.name,
            referredEmail: response.email,
            source: "5-day-lead-magnet-referral"
          });
          console.log('Referral tracked successfully');
        } catch (referralError) {
          console.warn('Failed to track referral:', referralError);
        }
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "Success!",
        description: "Your 5-Day Healthy Meals guide is on its way!",
        duration: 5000
      });
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist"] });
    },
    onError: (error: any) => {
      if (error.message?.includes("already registered")) {
        toast({
          title: "Already Registered",
          description: "This email is already on our waitlist. Check your inbox for the meal guide!",
          variant: "default"
        });
        setIsSubmitted(true);
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again or contact support if the issue persists.",
          variant: "destructive"
        });
      }
    }
  });

  const onSubmit = (data: LeadMagnetFormData) => {
    // Add dynamic source tracking to form data
    const dataWithSource = {
      ...data,
      source: `5-day-lead-magnet-${sourceData.source}${sourceData.campaign ? '-' + sourceData.campaign : ''}`
    };
    
    // Manual validation since zodResolver isn't available
    const validation = leadMagnetSchema.safeParse(dataWithSource);
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.issues[0].message,
        variant: "destructive"
      });
      return;
    }
    submitMutation.mutate(validation.data);
  };

  // Sharing functions
  const handleShare = async (platform: string) => {
    const shareUrl = `${window.location.origin}/5-day-meals`;
    const shareText = "Check out this FREE 5-Day Healthy Meals Guide from SavviWell! Perfect for busy families who want nutritious, delicious dinners.";
    
    // Track the share event if user data is available
    if (submitMutation.data?.name && submitMutation.data?.email) {
      try {
        await fetch('/api/share-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sharerEmail: submitMutation.data.email,
            sharerName: submitMutation.data.name,
            platform: platform,
            shareUrl: shareUrl
          })
        });
      } catch (error) {
        console.warn('Failed to track share event:', error);
        // Continue with sharing even if tracking fails
      }
    }
    
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        toast({
          title: "Link copied!",
          description: "Share link has been copied to your clipboard.",
        });
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        toast({
          title: "Link copied!",
          description: "Share link has been copied to your clipboard.",
        });
      }
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto text-center shadow-2xl border-0">
          <CardContent className="p-8 md:p-12">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 mx-auto mb-4" style={{ color: '#399E5A' }} />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                You're All Set!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Your <strong>5-Day Healthy Meals Guide</strong> is being prepared and will be delivered to your inbox within the next few minutes.
              </p>
              
              {/* Immediate Download Button */}
              <div className="mb-8">
                <Button 
                  onClick={() => {
                    // Direct PDF download
                    const link = document.createElement('a');
                    link.href = '/SavviWell-5-Day-Meals.pdf';
                    link.download = 'SavviWell-5-Day-Meals.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="text-white px-8 py-4 text-xl font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg mr-4"
                  style={{ backgroundColor: '#399E5A' }}
                >
                  <Download className="w-6 h-6 mr-3" />
                  Download PDF Guide
                </Button>
                
                {accessToken && (
                  <Button 
                    onClick={() => window.location.href = `/meal-guide?token=${accessToken}`}
                    variant="outline"
                    className="px-8 py-4 text-xl font-semibold border-2 hover:bg-gray-50 transition-colors duration-200"
                    style={{ borderColor: '#399E5A', color: '#399E5A' }}
                  >
                    View Online Guide
                  </Button>
                )}
                
                <p className="text-sm text-gray-500 mt-2">
                  Download instantly + check your email for the secure online version
                </p>
              </div>

              {/* Combined Sharing & Referral Campaign */}
              <div className="border-2 rounded-xl p-6 mb-8" style={{ backgroundColor: '#EFD8D0', borderColor: '#D4B5A8' }}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#8B4513' }}>
                    🎉 Want FREE Early Access to Our AI Wellness Tool?
                  </h3>
                  <p className="text-lg mb-4" style={{ color: '#A0522D' }}>
                    <strong>First 100 people who refer 3 friends get free early access!</strong>
                  </p>
                  <p className="text-sm mb-6" style={{ color: '#A0522D' }}>
                    Share this free guide with friends and unlock exclusive early access to our AI nutrition assistant.
                  </p>
                  
                  {/* Direct Sharing Buttons */}
                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <Button 
                      onClick={() => handleShare('copy')}
                      variant="outline"
                      className="flex items-center gap-2"
                      style={{ borderColor: '#399E5A', color: '#399E5A' }}
                    >
                      <Copy className="w-4 h-4" />
                      {copySuccess ? 'Copied!' : 'Copy Link'}
                    </Button>
                    <Button 
                      onClick={() => handleShare('facebook')}
                      variant="outline"
                      className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Share2 className="w-4 h-4" />
                      Facebook
                    </Button>
                    <Button 
                      onClick={() => handleShare('twitter')}
                      variant="outline"
                      className="flex items-center gap-2 text-blue-400 border-blue-400 hover:bg-blue-50"
                    >
                      <Share2 className="w-4 h-4" />
                      Twitter
                    </Button>
                    <Button 
                      onClick={() => handleShare('whatsapp')}
                      variant="outline"
                      className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <Share2 className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </div>
                  
                  {/* CTA for detailed tracking */}
                  <div className="space-y-4">
                    {accessToken ? (
                      <div>
                        <Button 
                          onClick={() => window.location.href = `/meal-guide?token=${accessToken}`}
                          className="text-white px-8 py-4 text-lg font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg"
                          style={{ backgroundColor: '#399E5A' }}
                        >
                          Get Your Personalized Referral Links →
                        </Button>
                        <p className="text-xs mt-2" style={{ color: '#A0522D' }}>
                          Access your meal guide for trackable referral links to earn free access
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm p-3 rounded" style={{ color: '#A0522D', backgroundColor: '#F5E6E0' }}>
                        Check your email for a secure link to access your meal guide and get personalized referral tracking!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: '#399E5A20' }}>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#399E5A' }}>What's Next?</h3>
                <ul className="space-y-2 text-left max-w-md mx-auto" style={{ color: '#399E5A' }}>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" style={{ color: '#399E5A' }} />
                    Check your email (including spam folder)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" style={{ color: '#399E5A' }} />
                    Download your meal planning guide
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" style={{ color: '#399E5A' }} />
                    Share with friends to earn free early access
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="px-8 py-3 text-lg border-2 hover:bg-gray-50 transition-colors duration-200"
                style={{ borderColor: '#399E5A', color: '#399E5A' }}
              >
                Explore SavviWell Platform
              </Button>
              <p className="text-sm text-gray-500">
                You've also been added to our early access waitlist for the SavviWell AI assistant!
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Check your email for a secure link to access your meal guide anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image and Centered Text */}
      <div 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center sm:left center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Get Your FREE<br />
              <span style={{ color: '#399E5A' }}>5-Day Healthy Meals</span><br />
              Planning Guide
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
              Transform your family's eating habits with our expertly crafted meal plans, shopping lists, and prep guides - all designed to make healthy eating effortless.
            </p>
            
            {/* Form Section in Hero */}
            <div className="max-w-md mx-auto">
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Get Your Free Guide Now
                  </CardTitle>
                  <p className="text-gray-600">Join families and individuals eating healthier</p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Your Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your first name" 
                                className="h-12 text-lg"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="your.email@example.com" 
                                className="h-12 text-lg"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        disabled={submitMutation.isPending}
                        className="w-full h-14 text-lg font-semibold text-white shadow-lg hover:opacity-90 transition-opacity duration-200"
                        style={{ backgroundColor: '#399E5A' }}
                      >
                        {submitMutation.isPending ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                            Preparing Your Guide...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Get My Free 5-Day Guide
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        We respect your privacy. Unsubscribe at any time. 
                        You'll also get early access to our AI nutrition assistant.
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            

          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              Why Families Love Our Meal Planning Guide
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm">
                <Clock className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: '#399E5A' }} />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Save 3+ Hours Weekly</h3>
                  <p className="text-gray-600 text-sm">No more wondering "what's for dinner?" - everything is planned for you.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm">
                <Utensils className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Simple, Delicious Recipes</h3>
                  <p className="text-gray-600 text-sm">Family-friendly meals that even picky eaters will love.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm">
                <Users className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Whole Family Approved</h3>
                  <p className="text-gray-600 text-sm">Nutritious meals designed for all ages and preferences.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm">
                <Heart className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Boost Energy & Health</h3>
                  <p className="text-gray-600 text-sm">Feel more energized with balanced, nutrient-rich meals.</p>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto rounded-xl p-8" style={{ backgroundColor: '#EFD8D0' }}>
              <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">What You'll Get:</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" style={{ color: '#399E5A' }} />
                    <span><strong>5 Delicious Dinner Plans</strong> - We've got your family dinners covered all week</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" style={{ color: '#399E5A' }} />
                    <span><strong>Shopping Lists</strong> - Organized by grocery store sections</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" style={{ color: '#399E5A' }} />
                    <span><strong>Prep Guide</strong> - Make-ahead tips to save even more time</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" style={{ color: '#399E5A' }} />
                    <span><strong>Nutrition Tips</strong> - Simple ways to boost your family's health</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">Trusted by families worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: '#399E5A' }} />
                  No Spam, Ever
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: '#399E5A' }} />
                  100% Free
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: '#399E5A' }} />
                  Instant Download
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}