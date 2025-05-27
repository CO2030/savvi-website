import { Button } from "@/components/ui/button";

interface HeroProps {
  onWaitlistClick: () => void;
}

export function Hero({ onWaitlistClick }: HeroProps) {
  return (
    <section 
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 flex items-center min-h-screen"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&h=1200')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading leading-tight mb-4 animate-fade-in">
            Welcome to SavviWell
          </h1>
          <p className="text-xl md:text-2xl text-white opacity-90 mb-4 animate-slide-in">
            Your Personalized nutrition and lifestyle AI assistant for Everyday Wellness—for Individuals and Families Alike
          </p>
          <p className="text-lg md:text-xl text-white opacity-95 mb-8 animate-slide-in" style={{animationDelay: "0.2s"}}>
            Join our beta program today and help shape the future of personalized nutrition!
          </p>
          <Button 
            onClick={onWaitlistClick}
            variant="outline" 
            size="lg"
            className="bg-white/90 hover:bg-white/60 text-primary hover:text-primary font-bold shadow-lg transition-all transform hover:scale-105 animate-slide-in border-white/80 hover:border-white/60"
          >
            Join the Waitlist
          </Button>
        </div>
      </div>
    </section>
  );
}
