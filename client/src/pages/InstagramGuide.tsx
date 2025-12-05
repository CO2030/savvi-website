import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Download, Shield, AlertTriangle, Globe, Users, MessageSquare, Lock, Share2, Copy } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import confetti from 'canvas-confetti';
import { Helmet } from 'react-helmet';
import backgroundVideo from "@assets/Green_&_Pink_Download_Free_Guide_Instagram_Post_1764964107744.mp4";

const getSourceFromURL = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('source') || urlParams.get('utm_source') || urlParams.get('ref');
  if (source) return source;
  
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

const getCampaignFromURL = (): string | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('utm_campaign') || urlParams.get('campaign') || undefined;
};

const getMediumFromURL = (): string | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('utm_medium') || urlParams.get('medium') || undefined;
};

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const instagramGuideSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  userType: z.literal("parent"),
  healthGoal: z.literal("other"),
  dietaryConcern: z.literal("none"),
  source: z.string()
});

type InstagramGuideFormData = z.infer<typeof instagramGuideSchema>;

export default function InstagramGuide() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [sourceData, setSourceData] = useState({
    source: 'direct',
    campaign: undefined as string | undefined,
    medium: undefined as string | undefined
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const source = getSourceFromURL();
    const campaign = getCampaignFromURL();
    const medium = getMediumFromURL();
    
    setSourceData({ source, campaign, medium });
    
    localStorage.setItem('user_source', source);
    if (campaign) localStorage.setItem('user_campaign', campaign);
    if (medium) localStorage.setItem('user_medium', medium);
    
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'instagram_guide_page_view', {
        page_title: "Instagram's Teen Accounts Guide - Mom Connect",
        page_location: window.location.href,
        source_attribution: source,
        campaign_attribution: campaign || 'none',
        medium_attribution: medium || 'none',
        event_category: 'lead_magnet',
        event_label: 'page_entry'
      });
    }
  }, []);

  const form = useForm<InstagramGuideFormData>({
    defaultValues: {
      name: "",
      email: "",
      userType: "parent",
      healthGoal: "other",
      dietaryConcern: "none",
      source: "instagram-teen-guide"
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InstagramGuideFormData) => {
      const response = await apiRequest("POST", "/api/waitlist", data);
      return response;
    },
    onSuccess: async (response: any) => {
      setIsSubmitted(true);
      setAccessToken(response.accessToken || "");
      
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'instagram_guide_conversion', {
          event_category: 'conversion',
          event_label: 'instagram_guide_signup',
          source_attribution: sourceData.source,
          campaign_attribution: sourceData.campaign || 'none',
          medium_attribution: sourceData.medium || 'none',
          conversion_value: 1,
          currency: 'USD'
        });
        
        window.gtag('event', 'purchase', {
          transaction_id: Date.now().toString(),
          value: 1,
          currency: 'USD',
          items: [{
            item_id: 'lead_magnet_instagram_teen_guide',
            item_name: "Instagram's Teen Accounts Guide",
            item_category: 'lead_magnet',
            quantity: 1,
            price: 1
          }],
          source_attribution: sourceData.source,
          campaign_attribution: sourceData.campaign || 'none'
        });
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "Success!",
        description: "Your Instagram Teen Accounts guide is on its way!",
        duration: 5000
      });
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist"] });
    },
    onError: (error: any) => {
      if (error.message?.includes("already registered")) {
        toast({
          title: "Already Registered",
          description: "This email is already registered. Check your inbox for the guide!",
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

  const onSubmit = (data: InstagramGuideFormData) => {
    const dataWithSource = {
      ...data,
      source: `instagram-teen-guide-${sourceData.source}${sourceData.campaign ? '-' + sourceData.campaign : ''}`
    };
    
    const validation = instagramGuideSchema.safeParse(dataWithSource);
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

  const handleShare = async (platform: string) => {
    const shareUrl = `${window.location.origin}/instagram-teen-guide`;
    const shareText = "Every parent needs this! Free guide on Instagram's Teen Accounts — what they really do and how to keep your kids safe online.";
    
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
      <>
        <Helmet>
          <title>Success! Your Guide is Ready | Mom Connect</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl mx-auto text-center shadow-2xl border-0">
            <CardContent className="p-8 md:p-12">
              <div className="mb-6">
                <CheckCircle className="w-20 h-20 mx-auto mb-4 text-purple-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" data-testid="text-success-title">
                  You're All Set!
                </h1>
                <p className="text-lg text-gray-600 mb-8" data-testid="text-success-message">
                  Your <strong>Instagram's Teen Accounts Guide</strong> is being prepared and will be delivered to your inbox within the next few minutes.
                </p>
                
                <div className="mb-8">
                  <Button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `/api/download-instagram-guide?token=${accessToken}`;
                      link.download = 'Instagram-Teen-Accounts-Guide.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="text-white px-8 py-4 text-xl font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg bg-purple-600 hover:bg-purple-700"
                    data-testid="button-download-pdf"
                  >
                    <Download className="w-6 h-6 mr-3" />
                    Download PDF Guide
                  </Button>
                  
                  <p className="text-sm text-gray-500 mt-2">
                    Download instantly + check your email for your copy
                  </p>
                </div>

                <div className="border-2 rounded-xl p-6 mb-8 bg-purple-50 border-purple-200">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-3 text-gray-800">
                      Know Another Mom Who Needs This?
                    </h3>
                    <p className="text-lg mb-4 text-gray-700">
                      Share this free guide with other parents navigating the digital world.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-3 mb-4">
                      <Button 
                        onClick={() => handleShare('copy')}
                        variant="outline"
                        className="flex items-center gap-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                        data-testid="button-share-copy"
                      >
                        <Copy className="w-4 h-4" />
                        {copySuccess ? 'Copied!' : 'Copy Link'}
                      </Button>
                      <Button 
                        onClick={() => handleShare('facebook')}
                        variant="outline"
                        className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                        data-testid="button-share-facebook"
                      >
                        <Share2 className="w-4 h-4" />
                        Facebook
                      </Button>
                      <Button 
                        onClick={() => handleShare('twitter')}
                        variant="outline"
                        className="flex items-center gap-2 text-blue-400 border-blue-400 hover:bg-blue-50"
                        data-testid="button-share-twitter"
                      >
                        <Share2 className="w-4 h-4" />
                        Twitter
                      </Button>
                      <Button 
                        onClick={() => handleShare('whatsapp')}
                        variant="outline"
                        className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
                        data-testid="button-share-whatsapp"
                      >
                        <Share2 className="w-4 h-4" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg p-6 mb-8 bg-purple-100">
                  <h3 className="text-xl font-semibold mb-3 text-purple-700">What's Next?</h3>
                  <ul className="space-y-2 text-left max-w-md mx-auto text-purple-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      Check your email (including spam folder)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      Download and read your guide
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      Start a conversation with your teen this week
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Part of Mom Connect — empowering moms with clarity, confidence, identity, and community in motherhood and beyond.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Instagram's Teen Accounts Guide | What Every Parent Needs to Know | Mom Connect</title>
        <meta name="description" content="Free 12-page guide for parents: Understand how Instagram actually protects teens and what YOU can do to keep your child safe, confident, and empowered online." />
        <meta property="og:title" content="Instagram's Teen Accounts — What Every Parent Needs to Know" />
        <meta property="og:description" content="Your essential 12-page guide to understanding how Instagram actually protects teens — and what YOU can do to keep your child safe." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen" style={{ backgroundColor: '#f5f0eb' }}>
        {/* Hero Header Section with Video */}
        <div className="relative py-12 md:py-16 px-4" style={{ backgroundColor: '#f5f0eb' }}>
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Video Side - Positioned to the right within its box with phone frame */}
              <div className="flex justify-center md:justify-end items-center">
                <div className="relative" style={{ maxWidth: '300px' }}>
                  {/* iPhone Frame */}
                  <div className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                    {/* Phone Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-10 flex items-center justify-center">
                      <div className="w-16 h-4 bg-black rounded-full"></div>
                    </div>
                    {/* Screen */}
                    <div className="rounded-[2.5rem] overflow-hidden bg-black">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full aspect-[9/19] object-cover"
                      >
                        <source src={backgroundVideo} type="video/mp4" />
                      </video>
                    </div>
                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Text Side */}
              <div className="text-center md:text-left">
                <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full">
                  <span className="text-purple-700 font-medium text-sm">Free Guide for Modern Moms</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight" data-testid="text-page-title">
                  Wait! Don't Miss This <span className="text-purple-600">Free Guide</span>
                </h1>
                <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4" data-testid="text-page-subtitle">
                  "Instagram's Teen Accounts — What Every Parent Needs to Know"
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  Your essential <strong>12-page guide</strong> to understanding how Instagram actually protects teens — and what <strong>YOU</strong> can do to keep your child safe online.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form and Benefits Section */}
        <div className="py-12 px-4" style={{ backgroundColor: '#f5f0eb' }}>
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Benefits Card */}
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl md:text-2xl font-bold text-gray-800">
                    Inside the Free Guide, You'll Learn:
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">How Instagram's Teen Accounts really work</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">What happens if a teen lies about their age</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Lock className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Whether IG shuts down after 60 minutes (and what actually happens)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Globe className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">How global laws in Australia, Denmark & the U.K. affect your family</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">What parents must know about teen creator accounts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">A simple parent checklist you can use this week</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MessageSquare className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Conversation scripts that create trust, not conflict</span>
                    </li>
                  </ul>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg mt-6">
                    <p className="text-purple-700 font-medium italic">
                      Feel informed. Feel empowered. Feel connected.
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      A must-have for moms raising teens in a digital world.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sign Up Form */}
              <Card className="shadow-2xl border-0 bg-white">
                <CardHeader className="text-center pb-4 bg-purple-600 rounded-t-xl">
                  <CardTitle className="text-2xl font-bold text-white">
                    Get Your Free PDF Now
                  </CardTitle>
                  <p className="text-purple-100">Delivered instantly to your inbox</p>
                </CardHeader>
                <CardContent className="p-6">
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
                                data-testid="input-name"
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
                                data-testid="input-email"
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
                        className="w-full h-14 text-lg font-semibold text-white shadow-lg bg-purple-600 hover:bg-purple-700 transition-all duration-200"
                        data-testid="button-submit"
                      >
                        {submitMutation.isPending ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                            Preparing Your Guide...
                          </>
                        ) : (
                          "Yes, Send Me the Guide"
                        )}
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center">
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                Part of <strong>Mom Connect</strong> — empowering moms with clarity, confidence, identity, and community in motherhood and beyond.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}