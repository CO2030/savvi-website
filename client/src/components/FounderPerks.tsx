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

        {/* Desktop Layout with Images on Right */}
        <div className="hidden md:grid md:grid-cols-5 gap-8 items-start">
          {/* Text Content - Takes up 3 columns */}
          <div className="md:col-span-3 space-y-8">
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

          {/* Images Section - Takes up 2 columns */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <img 
                  src="/images/salmon-asparagus.png" 
                  alt="Fresh salmon with potatoes and asparagus" 
                  className="w-full rounded-lg shadow-md"
                />
              </div>
              <div>
                <img 
                  src="/images/healthy-bowl.jpeg" 
                  alt="Nutritious green bowl with fresh ingredients" 
                  className="w-full rounded-lg shadow-md"
                />
              </div>
              <div>
                <img 
                  src="/images/vegetables.png" 
                  alt="Fresh meal prep ingredients organized" 
                  className="w-full rounded-lg shadow-md"
                />
              </div>
              <div>
                <img 
                  src="/images/family-meal.jpeg" 
                  alt="Healthy balanced meal with eggs and vegetables" 
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="md:hidden">
          {perks.map((perk, index) => (
            <motion.div
              key={index}
              className="sticky mb-4"
              style={{
                top: "20px",
                zIndex: 1,
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-50 border-none shadow-lg">
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
      </div>
    </section>
  );
}