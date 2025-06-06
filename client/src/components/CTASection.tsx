import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onWaitlistClick: () => void;
}

export function CTASection({ onWaitlistClick }: CTASectionProps) {
  return (
    <section className="relative py-16 px-4 text-white" 
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1543352634-99a5d50ae78e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&h=1200')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Smarter Meals. Healthier Living. Less Stress.</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">Join the waitlist to experience the voice AI assistant built for real life.</p>
        <Button 
          onClick={onWaitlistClick}
          size="lg"
          className="bg-primary hover:bg-primary/70 text-white font-bold shadow-lg transition-all transform hover:scale-105 px-8 py-4 text-lg md:text-xl"
        >
          Join the Waitlist
        </Button>
      </div>
    </section>
  );
}
