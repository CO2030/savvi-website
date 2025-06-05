import { Card, CardContent } from "@/components/ui/card";
import { Zap, Tag, MessageSquare } from "lucide-react";

export function FounderPerks() {
  const perks = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Early Access",
      description: "Early access to SavviWell's AI platform before it's available to the public."
    },
    {
      icon: <Tag className="h-6 w-6 text-primary" />,
      title: "Lifetime Discount",
      description: "Enjoy a lifetime discount on all premium plans as a founding member."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Direct Influence",
      description: "Influence product direction with your valuable feedback and suggestions."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 font-heading">Join the Beta for the AI Wellness Assistant That Thinks Ahead—So You Don't Have To</h1>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-lg md:text-xl text-neutral-dark mb-4">Become a founding member and enjoy early access to SavviWell's personalized, voice-powered wellness platform.</p>
          <p className="text-lg text-neutral-dark">As a beta user, you'll get exclusive perks, shape the future of AI-assisted healthy living, and be the first to experience a smarter way to nourish yourself and your family.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {perks.map((perk, index) => (
            <Card key={index} className="bg-gray-50 border-none hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  {perk.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-heading">{perk.title}</h3>
                <p className="text-neutral-dark">{perk.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
