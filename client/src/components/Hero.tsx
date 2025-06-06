import { Button } from "@/components/ui/button";

interface HeroProps {
  onWaitlistClick: () => void;
}

export function Hero({ onWaitlistClick }: HeroProps) {
  return (
    <section 
      className="relative pt-20 pb-12 px-4 flex items-center min-h-screen bg-center bg-cover bg-no-repeat md:pt-32 md:pb-24"
      style={{
        backgroundImage: "url('/images/hero-background.jpeg')"
      }}
      aria-label="Hero section"
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden="true"></div>
      <div className="container mx-auto relative z-10">
        <header className="max-w-2xl text-center mx-auto md:text-left md:mx-0">
          <h1 className="text-3xl font-bold text-white font-heading leading-tight mb-4 animate-fade-in sm:text-4xl md:text-5xl lg:text-6xl">
            Smarter Meals.<br />Healthier Lives.<br />Less Stress.
          </h1>
          <p className="text-lg text-white opacity-90 mb-4 animate-slide-in sm:text-xl md:text-2xl">
            Meet <span className="font-bold">SavviWell</span> — your voice AI assistant for healthy meals, grocery delivery, quick recipe ideas, and wellness support when life gets busy.
          </p>
          <p className="text-base text-white opacity-95 mb-8 animate-slide-in sm:text-lg md:text-xl" style={{animationDelay: "0.2s"}}>
            Join the beta. Let <span className="font-bold">SavviWell</span> help carry the load.
          </p>
          <Button 
            onClick={onWaitlistClick}
            size="lg"
            className="bg-primary hover:bg-primary/70 text-white font-bold shadow-lg transition-all transform hover:scale-105 animate-slide-in px-8 py-4 text-lg md:text-xl w-full sm:w-auto"
            aria-label="Join the SavviWell waitlist"
          >
            Join the Waitlist
          </Button>
        </header>
      </div>
    </section>
  );
}
