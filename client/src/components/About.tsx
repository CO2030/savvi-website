import { motion } from 'framer-motion';
import { Brain, Users, Utensils, ShoppingCart, RefreshCw, ChefHat, Mic, Heart } from "lucide-react";

export function About() {
  const features = [
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "AI-Powered Nutrition",
      description: (
        <>
          <strong>Personalized meal recommendations</strong> based on your dietary preferences, health goals, and real-life needs.
        </>
      )
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Family-Focused Flexibility",
      description: (
        <>
          Built for households with <strong>multiple needs</strong>—accommodate allergies, picky eaters, and unique goals with ease.
        </>
      )
    },
    {
      icon: <Utensils className="h-6 w-6 text-primary" />,
      title: "Personalized Meal Planning",
      description: (
        <>
          <strong>Custom plans</strong> shaped by your lifestyle, schedule, and preferences—from quick comfort meals to clean eating.
        </>
      )
    },
    {
      icon: <ShoppingCart className="h-6 w-6 text-primary" />,
      title: "Smart Grocery Lists & Delivery",
      description: (
        <>
          Generate grocery lists in <strong>one tap</strong>—automatically aligned with your plan and pantry, ready to send to delivery partners.
        </>
      )
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-primary" />,
      title: "Flexible Ingredient Swaps",
      description: (
        <>
          <strong>Easily adjust recipes</strong> for dietary needs, last-minute changes, or mood-based cravings—without the stress.
        </>
      )
    },
    {
      icon: <ChefHat className="h-6 w-6 text-primary" />,
      title: "Pantry-Based Recipe Suggestions",
      description: (
        <>
          Make the most of what you already have. No more endless scrolling—just <strong>smart, satisfying ideas</strong>.
        </>
      )
    },
    {
      icon: <Mic className="h-6 w-6 text-primary" />,
      title: "Voice-First, Hands-Free Experience",
      description: (
        <>
          <strong>Talk to SavviWell</strong> to get answers, plan your next meal, or change course—without lifting a finger.
        </>
      )
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Wellness Support That Grows With You",
      description: (
        <>
          From <strong>food as fuel to food as medicine</strong>, get adaptive support and gentle nudges to help build long-term healthy habits.
        </>
      )
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
        <p className="text-neutral-dark text-center max-w-2xl mx-auto mb-8">Transforming how families plan, shop, and eat together</p>
        
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto mb-12">
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center">
              <strong>Imagine having someone who just <em><strong>gets it</strong></em>.</strong>
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center">
              The never-ending meal planning. The picky eaters. The special diets. The 5:45pm panic: <em>"What are we eating tonight?"</em>
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center">
              Now imagine your <strong>AI assistant</strong> already has the answer—one that fits your goals, your groceries, and your time.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center">
              <strong>SavviWell is your voice-guided partner in healthy living</strong>, built for real families and individuals navigating real life. It's more than meal planning. It's personalized support that grows with you, lightens the mental load, and helps you stay well without overthinking it.
            </p>
          </div>
        </div>

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
              <div className="text-sm text-neutral-dark leading-relaxed">
                {feature.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Vertical Layout with Stacking */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-4 rounded-2xl shadow-xl sticky"
                style={{
                  top: `${20 + (index % 2) * 10}px`,
                  zIndex: features.length - index,
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 font-heading">{feature.title}</h3>
                <div className="text-xs text-neutral-dark leading-relaxed">
                  {feature.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}