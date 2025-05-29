import { useState, useEffect } from 'react';
import { 
  Share,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SocialShare } from './SocialShare';

export function FloatingShareButton() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 300px from the top
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      <SocialShare
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title="Check out SavviWell - AI-powered nutrition recommendations!"
        description="SavviWell uses AI to deliver personalized nutrition plans. Join the waitlist for early access!"
        className="shadow-md rounded-full bg-white hover:bg-gray-50 text-primary h-10 w-10 p-0"
        iconSize={20}
        rounded={true}
        buttonText=""
        showButtonText={false}
      />
      
      <Button 
        size="sm" 
        className="rounded-full shadow-md h-10 w-10 p-0"
        onClick={scrollToTop}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
}