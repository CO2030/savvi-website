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
  const baseUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Add UTM parameters for each platform
  const createShareUrl = (platform: string) => {
    const urlObj = new URL(baseUrl);
    urlObj.searchParams.set('utm_source', platform);
    urlObj.searchParams.set('utm_medium', 'social');
    urlObj.searchParams.set('utm_campaign', 'share');
    return urlObj.toString();
  };

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
      <PopoverContent className="w-auto p-2" align="end">
        <div className="flex gap-2 items-center">
          <FacebookShareButton url={createShareUrl('facebook')} hashtag="#SavviWell" className="transition-opacity hover:opacity-80">
            <FacebookIcon size={iconSize} round={rounded} borderRadius={iconRadius} />
          </FacebookShareButton>

          <TwitterShareButton url={createShareUrl('twitter')} title={title} className="transition-opacity hover:opacity-80">
            <TwitterIcon size={iconSize} round={rounded} borderRadius={iconRadius} />
          </TwitterShareButton>

          <LinkedinShareButton url={createShareUrl('linkedin')} title={title} summary={description} className="transition-opacity hover:opacity-80">
            <LinkedinIcon size={iconSize} round={rounded} borderRadius={iconRadius} />
          </LinkedinShareButton>

          <WhatsappShareButton url={createShareUrl('whatsapp')} title={title} className="transition-opacity hover:opacity-80">
            <WhatsappIcon size={iconSize} round={rounded} borderRadius={iconRadius} />
          </WhatsappShareButton>

          <EmailShareButton url={createShareUrl('email')} subject={title} body={description} className="transition-opacity hover:opacity-80">
            <EmailIcon size={iconSize} round={rounded} borderRadius={iconRadius} />
          </EmailShareButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}