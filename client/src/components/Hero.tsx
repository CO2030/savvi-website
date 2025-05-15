import { Button } from "@/components/ui/button";
import { SocialShare } from "./SocialShare";

interface HeroProps {
  onWaitlistClick: () => void;
}

export function Hero({ onWaitlistClick }: HeroProps) {
  return (
    <section 
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 flex items-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&h=1200')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90 opacity-85"></div>
      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading leading-tight mb-4 animate-fade-in">
            Smarter meals.<br/>Healthier lives.
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90 mb-8 animate-slide-in">
            Be the first to test our beta and shape the future of personalized nutrition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={onWaitlistClick}
              variant="outline" 
              size="lg"
              className="bg-white hover:bg-gray-100 text-primary hover:text-primary-dark font-bold shadow-lg transition-all transform hover:scale-105 animate-slide-in"
            >
              Join the Waitlist
            </Button>
            
            <SocialShare
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title="Discover SavviWell - AI-powered nutrition recommendations tailored to your needs!"
              description="SavviWell uses AI to deliver personalized nutrition recommendations. Join the waitlist for early access!"
              className="bg-white hover:bg-gray-100 text-primary hover:text-primary-dark font-bold shadow-md animate-slide-in"
              buttonText="Share SavviWell"
              showButtonText={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
