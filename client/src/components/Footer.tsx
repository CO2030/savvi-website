import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Send,
  Share,
  Check
} from "lucide-react";
import { FaPinterest, FaTiktok } from "react-icons/fa";
import { SiWhatsapp } from "react-icons/si";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(() => {
    // Check if user has already subscribed in localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('newsletter-subscribed') === 'true';
    }
    return false;
  });
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const result = await response.json();
      
      // Handle already subscribed case
      if (result.alreadySubscribed) {
        toast({
          title: "Already subscribed",
          description: "This email is already subscribed to our newsletter.",
          variant: "default"
        });
      } else {
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for subscribing to our newsletter.",
          variant: "default"
        });
      }
      
      // Save subscription status to localStorage
      localStorage.setItem('newsletter-subscribed', 'true');
      setIsSubscribed(true);
      setEmail("");
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription failed",
        description: error.message || "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo color="white" className="mb-4" />
            <p className="text-gray-300 mb-4">Personalized nutrition powered by AI for healthier lives.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.pinterest.com/savviwell/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <FaPinterest className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@savviwell" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <FaTiktok className="h-5 w-5" />
              </a>
              <a href="https://whatsapp.com/channel/0029Vb6QFzD35fLvJkkAOq3N" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <SiWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Company</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Stay Updated</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates.</p>
            {!isSubscribed ? (
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="rounded-r-none border-gray-700 bg-gray-800 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button 
                  className="rounded-l-none" 
                  size="icon" 
                  onClick={handleSubscribe}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-primary/20 text-white p-3 rounded-md">
                <Check className="h-5 w-5 text-primary" />
                <span>Thank you for subscribing!</span>
              </div>
            )}
          </div>
        </div>
        {/* Share With Friends Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 pb-4 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold mb-4 font-heading">Share SavviWell with Friends</h3>
          <p className="text-gray-300 mb-4 text-center max-w-md">
            Help us spread the word about AI-powered nutrition recommendations!
          </p>
          
          <div className="flex gap-4 mb-6">
            <FacebookShareButton 
              url={typeof window !== 'undefined' ? window.location.href : ''} 
              hashtag="#SavviWell"
              className="transition-transform hover:scale-110"
            >
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            
            <TwitterShareButton 
              url={typeof window !== 'undefined' ? window.location.href : ''} 
              title="Join me in exploring AI-powered nutrition recommendations with SavviWell!" 
              className="transition-transform hover:scale-110"
            >
              <TwitterIcon size={40} round />
            </TwitterShareButton>
            
            <LinkedinShareButton 
              url={typeof window !== 'undefined' ? window.location.href : ''} 
              title="SavviWell - AI-Powered Nutrition"
              summary="Personalized nutrition recommendations powered by AI. Join the waitlist for early access!" 
              className="transition-transform hover:scale-110"
            >
              <LinkedinIcon size={40} round />
            </LinkedinShareButton>
            
            <WhatsappShareButton 
              url={typeof window !== 'undefined' ? window.location.href : ''} 
              title="Check out SavviWell - AI-powered nutrition recommendations!"
              className="transition-transform hover:scale-110"
            >
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} SavviWell. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
