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
              <a href="https://www.instagram.com/savviwell/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@savviwell" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <FaTiktok className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Company</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              <li><a href="/story" className="text-gray-300 hover:text-white transition-colors">Our Story</a></li>
              <li><a href="/podcast" className="text-gray-300 hover:text-white transition-colors">Podcast</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Support</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li><a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-300">
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
