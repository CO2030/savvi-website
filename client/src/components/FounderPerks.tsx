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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-heading">Founder & Beta Member Perks</h2>
        <p className="text-neutral-dark text-center max-w-2xl mx-auto mb-12">Join as an early member and enjoy exclusive benefits</p>
        
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {perks.map((perk, index) => (
            <Card key={index} className="bg-gray-50 border-none hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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

        {/* Mobile Vertical Stack */}
        <div className="md:hidden space-y-4 relative">
          {perks.map((perk, index) => (
            <Card 
              key={index} 
              className="bg-gray-50 border-none shadow-md relative z-10 transform transition-all duration-300"
              style={{
                marginTop: index === 0 ? '0' : '-8px',
                zIndex: perks.length - index
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    {perk.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3 font-heading">{perk.title}</h3>
                    <p className="text-neutral-dark">{perk.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
