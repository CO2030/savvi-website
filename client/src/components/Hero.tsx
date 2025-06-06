import { Button } from "@/components/ui/button";

interface HeroProps {
  onWaitlistClick: () => void;
}

export function Hero({ onWaitlistClick }: HeroProps) {
  return (
    <section 
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 flex items-center min-h-[70vh] md:min-h-screen bg-top md:bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/images/hero-background.jpeg')"
      }}
      aria-label="Hero section"
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden="true"></div>
      <div className="container mx-auto relative z-10">
        <header className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading leading-tight mb-4 animate-fade-in">
            Smarter Meals. Healthier Lives. Less Stress.
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90 mb-4 animate-slide-in">
            Meet SavviWell — your voice AI assistant for healthy meals, grocery delivery, quick recipe ideas, and wellness support when life gets busy.
          </p>
          <p className="text-lg md:text-xl text-white opacity-95 mb-8 animate-slide-in" style={{animationDelay: "0.2s"}}>
            Join the beta. Let SavviWell carry the load.
          </p>
          <Button 
            onClick={onWaitlistClick}
            size="lg"
            className="bg-primary hover:bg-primary/70 text-white font-bold shadow-lg transition-all transform hover:scale-105 animate-slide-in"
            aria-label="Join the SavviWell waitlist"
          >
            Join the Waitlist
          </Button>
        </header>
      </div>
    </section>
  );
}
