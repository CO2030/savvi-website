import { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  className?: string;
  iconSize?: number;
  rounded?: boolean;
  buttonText?: string;
  showButtonText?: boolean;
}

export function SocialShare({
  url,
  title,
  description,
  className,
  iconSize = 32,
  rounded = true,
  buttonText = "Share",
  showButtonText = true
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Default to current URL if none provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Apply rounded corners if specified
  const iconRadius = rounded ? 8 : 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn("gap-2", className)}
        >
          <Share className="h-4 w-4" />
          {showButtonText && buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="end">
        <div className="flex gap-2 flex-wrap">
          <FacebookShareButton url={shareUrl} hashtag="#SavviWell" className="transition-opacity hover:opacity-80">
            <FacebookIcon size={iconSize} round={rounded} borderRadius={iconRadius} />
          </FacebookShareButton>
          
          <TwitterShareButton url={shareUrl} title={title} className="transition-opacity hover:opacity-80">
            <TwitterIcon size={iconSize} round={rounded} borderRadius={iconRadius} />
          </TwitterShareButton>
          
          <LinkedinShareButton url={shareUrl} title={title} summary={description} className="transition-opacity hover:opacity-80">
            <LinkedinIcon size={iconSize} round={rounded} borderRadius={iconRadius} />
          </LinkedinShareButton>
          
          <WhatsappShareButton url={shareUrl} title={title} className="transition-opacity hover:opacity-80">
            <WhatsappIcon size={iconSize} round={rounded} borderRadius={iconRadius} />
          </WhatsappShareButton>
          
          <EmailShareButton url={shareUrl} subject={title} body={description} className="transition-opacity hover:opacity-80">
            <EmailIcon size={iconSize} round={rounded} borderRadius={iconRadius} />
          </EmailShareButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}