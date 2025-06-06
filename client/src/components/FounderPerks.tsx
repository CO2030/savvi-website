
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

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
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              transition={{ delay: index * 0.2 }}
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
        <div className="md:hidden relative h-[400px] overflow-hidden">
          {perks.map((perk, index) => (
            <motion.div
              key={index}
              style={{
                top: `${index * 80}px`,
                zIndex: perks.length - index,
              }}
              initial={{ 
                opacity: index < 2 ? 1 : 0.8,
                scale: 1 - index * 0.03,
                y: index * 30 
              }}
              whileInView={{ 
                opacity: 1,
                scale: 1 - index * 0.03,
                y: index * 30 
              }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="absolute inset-x-0 bg-gray-50 border-none shadow-lg">
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
          
          {/* Scroll indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 flex items-center space-x-1">
            <span>Swipe up to explore</span>
            <div className="w-1 h-4 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
