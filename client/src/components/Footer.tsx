import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Send,
  Share
} from "lucide-react";
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
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Company</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Stay Updated</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="rounded-r-none border-gray-700 bg-gray-800 text-white"
              />
              <Button className="rounded-l-none" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
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
