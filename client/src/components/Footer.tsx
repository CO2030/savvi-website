import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { ContactModal } from "./ContactModal";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Send,
  Share,
  Check,
  Mail
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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
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
      const { getTrackingData } = await import('@/lib/tracking');
      const tracking = getTrackingData();
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, ...tracking })
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
    <footer className="bg-gray-900 text-white py-6 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo color="white" />
            <div className="flex space-x-3">
              <a href="https://www.instagram.com/savviwell/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@savviwell" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <FaTiktok className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-300">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="/story" className="hover:text-white transition-colors">Our Story</a>
            <a href="/podcast" className="hover:text-white transition-colors">Podcast</a>
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Contact Us
            </button>
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-4 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SavviWell. All rights reserved.</p>
        </div>
      </div>
      
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </footer>
  );
}
