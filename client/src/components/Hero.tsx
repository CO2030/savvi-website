import { Button } from "@/components/ui/button";

interface HeroProps {
  onWaitlistClick: () => void;
}

export function Hero({ onWaitlistClick }: HeroProps) {
  return (
    <section 
      className="hero pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-32 md:pb-24 px-4 flex items-center bg-top md:bg-center"
      style={{
        backgroundImage: "url('/images/hero-background.jpeg')"
      }}
      aria-label="Hero section"
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden="true"></div>
      <div className="container mx-auto relative z-10">
        <header className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white font-heading leading-tight mb-3 sm:mb-4 animate-fade-in">
            Smarter Meals.<br />Healthier Lives.<br />Less Stress.
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white opacity-90 mb-3 sm:mb-4 animate-slide-in">
            Meet <span className="font-bold">SavviWell</span> — your voice AI assistant for healthy meals, grocery delivery, quick recipe ideas, and wellness support when life gets busy.
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white opacity-95 mb-6 sm:mb-8 animate-slide-in" style={{animationDelay: "0.2s"}}>
            Join the beta. Let <span className="font-bold">SavviWell</span> help carry the load.
          </p>
          <Button 
            onClick={onWaitlistClick}
            size="lg"
            className="bg-primary hover:bg-primary/70 text-white font-bold shadow-lg transition-all transform hover:scale-105 animate-slide-in px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg md:text-xl"
            aria-label="Join the SavviWell waitlist"
          >
            Join the Waitlist
          </Button>
        </header>
      </div>
    </section>
  );
}
