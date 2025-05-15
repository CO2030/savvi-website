import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onWaitlistClick: () => void;
}

export function CTASection({ onWaitlistClick }: CTASectionProps) {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-primary/90 to-secondary/90 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Ready to transform your nutrition?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">Join our waitlist today and be the first to experience SavviWell's personalized nutrition platform.</p>
        <Button 
          onClick={onWaitlistClick}
          variant="outline" 
          size="lg"
          className="bg-white hover:bg-gray-100 text-primary hover:text-primary-dark font-bold shadow-lg transition-all transform hover:scale-105"
        >
          Join the Waitlist
        </Button>
      </div>
    </section>
  );
}
