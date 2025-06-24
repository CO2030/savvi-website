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
import { Card, CardContent } from '@/components/ui/card';

interface ShareSuccessProps {
  className?: string;
  iconSize?: number;
}

export function ShareSuccess({
  className,
  iconSize = 40
}: ShareSuccessProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = "I just joined the SavviWell waitlist for AI-powered nutrition recommendations! 🥗";
  const shareMessage = "I'm excited to get personalized health and nutrition insights from SavviWell. Join me on the waitlist!";
  
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-3 text-center">Share your excitement!</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Tell your friends about SavviWell and help us grow
        </p>
        
        <div className="flex justify-center gap-4">
          <FacebookShareButton url={shareUrl} hashtag="#SavviWell" className="transition-transform hover:scale-110">
            <FacebookIcon size={iconSize} round />
          </FacebookShareButton>
          
          <LinkedinShareButton url="https://www.linkedin.com/company/savviwell/" title={shareTitle} summary={shareMessage} className="transition-transform hover:scale-110">
            <LinkedinIcon size={iconSize} round />
          </LinkedinShareButton>
          
          <WhatsappShareButton url={shareUrl} title={`${shareTitle}\n\n${shareMessage}`} className="transition-transform hover:scale-110">
            <WhatsappIcon size={iconSize} round />
          </WhatsappShareButton>
        </div>
        
        <div className="mt-4 text-xs text-center text-muted-foreground">
          Sharing helps us reach more people like you!
        </div>
      </CardContent>
    </Card>
  );
}