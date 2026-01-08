import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Download, Utensils, ShoppingCart, Heart, Clock, Share2, Copy } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import confetti from 'canvas-confetti';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import foundersImage from "@assets/meara-christina-founders_1749580938646.png";

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

const healthyMealsGuideSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  userType: z.literal("parent"),
  healthGoal: z.literal("other"),
  dietaryConcern: z.literal("none"),
  source: z.string()
});

type HealthyMealsGuideFormData = z.infer<typeof healthyMealsGuideSchema>;

export default function HealthyMealsGuide() {
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
      window.gtag('event', 'healthy_meals_guide_page_view', {
        page_title: "3 Easy Healthy Meals Guide - SavviWell Podcast",
        page_location: window.location.href,
        source_attribution: source,
        campaign_attribution: campaign || 'none',
        medium_attribution: medium || 'none',
        event_category: 'lead_magnet',
        event_label: 'page_entry'
      });
    }
  }, []);

  const form = useForm<HealthyMealsGuideFormData>({
    defaultValues: {
      name: "",
      email: "",
      userType: "parent",
      healthGoal: "other",
      dietaryConcern: "none",
      source: "healthy-meals-guide"
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: HealthyMealsGuideFormData) => {
      const res = await fetch("/api/waitlist/healthy-meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });
      const responseData = await res.json();
      if (!res.ok) {
        const error = new Error(responseData.message || "Request failed") as any;
        error.accessToken = responseData.accessToken;
        error.alreadyRegistered = responseData.alreadyRegistered;
        throw error;
      }
      return responseData;
    },
    onSuccess: async (response: any) => {
      setIsSubmitted(true);
      setAccessToken(response.accessToken || "");
      
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'healthy_meals_guide_conversion', {
          event_category: 'conversion',
          event_label: 'healthy_meals_guide_signup',
          source_attribution: sourceData.source,
          campaign_attribution: sourceData.campaign || 'none',
          medium_attribution: sourceData.medium || 'none',
          conversion_value: 1,
          currency: 'USD'
        });
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "Success!",
        description: "Your 3 Easy Healthy Meals guide is on its way!",
        duration: 5000
      });
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist"] });
    },
    onError: (error: any) => {
      if (error.message?.includes("already registered")) {
        setIsSubmitted(true);
        setAccessToken(error.accessToken || "");
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast({
          title: "Welcome back!",
          description: "You already have access to this guide. Check your email or download below!",
          duration: 5000
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to submit. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const onSubmit = (data: HealthyMealsGuideFormData) => {
    const enrichedData = {
      ...data,
      source: sourceData.source,
      campaign: sourceData.campaign,
      medium: sourceData.medium
    };
    submitMutation.mutate(enrichedData as HealthyMealsGuideFormData);
  };

  const handleShare = (platform: string) => {
    const shareUrl = window.location.href;
    const shareText = "Check out this free guide: 3 Easy Healthy Meals for busy families!";
    
    if (platform === 'copy') {
      try {
        navigator.clipboard.writeText(shareUrl);
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
          <title>Success! Your Guide is Ready | SavviWell Podcast</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl mx-auto text-center shadow-2xl border-0">
            <CardContent className="p-8 md:p-12">
              <div className="mb-6">
                <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" data-testid="text-success-title">
                  You're All Set!
                </h1>
                <p className="text-lg text-gray-600 mb-8" data-testid="text-success-message">
                  Your <strong>3 Easy Healthy Meals</strong> guide is being prepared and will be delivered to your inbox within the next few minutes.
                </p>
                
                <div className="mb-8">
                  <Button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `/api/download-healthy-meals-guide?token=${accessToken}`;
                      link.download = '3-Easy-Healthy-Meals-Guide.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="text-white px-8 py-4 text-xl font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg bg-green-600 hover:bg-green-700"
                    data-testid="button-download-pdf"
                  >
                    <Download className="w-6 h-6 mr-3" />
                    Download PDF Guide
                  </Button>
                  
                  <p className="text-sm text-gray-500 mt-2">
                    Download instantly + check your email for your copy
                  </p>
                </div>

                <div className="border-2 rounded-xl p-6 mb-8 bg-green-50 border-green-200">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-green-700 mb-4">Share with a Friend</h3>
                    <p className="text-gray-600 mb-4">Know someone who could use simple, healthy meal ideas?</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button 
                        onClick={() => handleShare('copy')}
                        variant="outline"
                        className={`flex items-center gap-2 ${copySuccess ? 'bg-green-100 text-green-700 border-green-500' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        data-testid="button-copy-link"
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

                <div className="rounded-lg p-6 mb-8 bg-green-100">
                  <h3 className="text-xl font-semibold mb-3 text-green-700">What's Next?</h3>
                  <ul className="space-y-2 text-left max-w-md mx-auto text-green-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Check your email (including spam folder)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Download and browse your meal guide
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Pick one meal to try this week
                    </li>
                  </ul>
                </div>
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
        <title>3 Easy Healthy Meals - Free Guide | SavviWell Podcast</title>
        <meta name="description" content="Download your free guide with 3 easy, healthy family meals plus smart grocery lists. Simple meals, less mental load, and healthy habits without overwhelm." />
        <meta property="og:title" content="3 Easy Healthy Meals - Free Guide | SavviWell Podcast" />
        <meta property="og:description" content="Download your free guide with 3 easy, healthy family meals plus smart grocery lists. Simple meals, less mental load, and healthy habits without overwhelm." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen" style={{ backgroundColor: '#f5f0eb' }}>
        {/* Podcast Branding Header */}
        <div className="bg-primary py-4 px-4">
          <div className="container mx-auto max-w-6xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                <img 
                  src={foundersImage} 
                  alt="Meara and Christina" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-white text-base md:text-lg font-bold">The SavviWell Podcast</h2>
                <p className="text-white/90 text-xs md:text-sm italic">Wellbeing for Modern Life</p>
              </div>
            </div>
            <nav className="flex items-center gap-4 md:gap-6">
              <Link href="/podcast" className="text-white hover:text-white/80 text-sm md:text-base font-medium transition-colors">
                Podcast
              </Link>
              <Link href="/contact" className="text-white hover:text-white/80 text-sm md:text-base font-medium transition-colors">
                Contact Us
              </Link>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="py-8 md:py-12 px-4" style={{ backgroundColor: '#f5f0eb' }}>
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-green-100 rounded-full">
              <span className="text-green-700 font-medium text-sm">Free Guide for Busy Families</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight" data-testid="text-page-title">
              A Gentle <span className="text-green-600">January Reset</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4" data-testid="text-page-subtitle">
              3 Easy Meals to Get Back Into Healthy Eating
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three Easy Healthy Family Meals
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="py-6 px-4" style={{ backgroundColor: '#f5f0eb' }}>
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              
              {/* Left Column - Content */}
              <div className="space-y-6">
                <Card className="shadow-lg border-0 bg-white">
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4">
                      If healthy eating feels harder than it should — especially when you're cooking for a family — this guide is for you.
                    </p>
                    <p className="text-gray-700 mb-4">
                      January doesn't have to mean restriction, perfection, or starting over. This gentle reset is about simple meals, less mental load, and getting back into healthy habits without overwhelm.
                    </p>
                    <p className="text-gray-700">
                      In this SavviWell podcast episode, we're sharing three easy, healthy family meals that are realistic, flexible, and designed for real life. These are the kinds of meals you can rely on during busy weeks — without complicated recipes, separate dinners, or decision fatigue.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-green-50 border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">
                      <Utensils className="w-6 h-6" />
                      Free Guide Included
                    </h3>
                    <p className="text-gray-700 mb-4">
                      We've put together a free SavviWell guide featuring these three meals plus smart grocery lists to make planning and shopping easier.
                    </p>
                    <p className="text-gray-700 font-medium mb-3">This guide is designed to help you:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        Feed your family without stress
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        Simplify healthy eating
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        Feel confident about what's for dinner — again
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                      🎧 In This Episode, We Cover:
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <Heart className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        Three easy, healthy family meals that actually work
                      </li>
                      <li className="flex items-start gap-2">
                        <Utensils className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        What makes a meal truly family-friendly
                      </li>
                      <li className="flex items-start gap-2">
                        <ShoppingCart className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        How to simplify healthy eating without overthinking it
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        Small mindset shifts that reduce the mental load around food
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Form */}
              <div className="md:sticky md:top-8">
                <Card className="shadow-2xl border-0 bg-white">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      👇 Download Your Free Guide
                    </CardTitle>
                    <p className="text-gray-600 mt-2">
                      Get instant access to 3 easy, healthy meals + grocery lists
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">First Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your first name" 
                                  className="h-12 text-lg border-2 focus:border-green-500"
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
                              <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email"
                                  placeholder="Enter your email" 
                                  className="h-12 text-lg border-2 focus:border-green-500"
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
                          className="w-full h-14 text-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all transform hover:scale-[1.02]"
                          disabled={submitMutation.isPending}
                          data-testid="button-submit"
                        >
                          {submitMutation.isPending ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin">⏳</span> Sending...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Download className="w-6 h-6" />
                              Get My Free Guide
                            </span>
                          )}
                        </Button>

                        <p className="text-center text-sm text-gray-500 mt-4">
                          Your guide will be sent to your email instantly. No spam, ever.
                        </p>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
