import { motion } from 'framer-motion';
import { Brain, Users, Utensils, ShoppingCart } from "lucide-react";

export function About() {
  const features = [
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "AI-Powered Nutrition",
      description: "Smart meals tailored to your health goals and dietary preferences."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Family-Focused",
      description: "Built for real households with diverse needs and busy schedules."
    },
    {
      icon: <Utensils className="h-6 w-6 text-primary" />,
      title: "Personalized Planning",
      description: "Meal plans that match your time, budget, and lifestyle."
    },
    {
      icon: <ShoppingCart className="h-6 w-6 text-primary" />,
      title: "Smart Grocery Lists",
      description: "Auto-generated shopping lists optimized for delivery or pickup."
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="about" className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-heading">Your Voice AI Assistant for Everyday Wellness</h2>
        <p className="text-neutral-dark text-center max-w-2xl mx-auto mb-12">Transforming how families plan, shop, and eat together</p>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-xl"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">{feature.title}</h3>
              <p className="text-sm text-neutral-dark leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Stacked Cards */}
        <div className="md:hidden space-y-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-xl sticky"
              style={{
                top: `${20 + index * 20}px`,
                zIndex: features.length - index,
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">{feature.title}</h3>
              <p className="text-sm text-neutral-dark leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}