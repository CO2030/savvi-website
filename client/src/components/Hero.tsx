import { Button } from "@/components/ui/button";

interface HeroProps {
  onWaitlistClick: () => void;
}

export function Hero({ onWaitlistClick }: HeroProps) {
  return (
    <section 
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 flex items-center min-h-screen"
      style={{
        backgroundImage: "url('/images/hero-background.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading leading-tight mb-4 animate-fade-in">
            Your food. Your wellness—reimagined with AI.
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90 mb-4 animate-slide-in">
            Effortless meal planning, smart grocery lists, and adaptive wellness support—personalized for individuals and families alike. It all starts in the kitchen.
          </p>
          <p className="text-lg md:text-xl text-white opacity-95 mb-8 animate-slide-in" style={{animationDelay: "0.2s"}}>
            Join the beta and shape the future of food-first wellness.
          </p>
          <Button 
            onClick={onWaitlistClick}
            size="lg"
            className="bg-primary hover:bg-primary/70 text-white font-bold shadow-lg transition-all transform hover:scale-105 animate-slide-in"
          >
            Join the Waitlist
          </Button>
        </div>
      </div>
    </section>
  );
}
