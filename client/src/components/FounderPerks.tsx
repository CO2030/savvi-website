import { Card, CardContent } from "@/components/ui/card";
import { Zap, Tag, MessageSquare } from "lucide-react";
import { motion } from 'framer-motion';

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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="bg-gray-50 border-none hover:shadow-md transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    {perk.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-heading">{perk.title}</h3>
                  <p className="text-neutral-dark">{perk.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile Stacked Cards */}
        <div className="md:hidden relative min-h-[500px]">
          {perks.map((perk, index) => (
            <motion.div
              key={index}
              className="absolute inset-x-0"
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              whileInView={{ 
                opacity: 1, 
                y: index * 80, 
                scale: 1 - index * 0.03,
                zIndex: perks.length - index
              }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.3,
                type: "spring",
                stiffness: 100
              }}
              style={{
                top: `${index * 30}px`,
                zIndex: perks.length - index
              }}
            >
              <Card className="bg-gray-50 border-none shadow-lg">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
