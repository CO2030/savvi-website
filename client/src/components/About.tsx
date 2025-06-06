import { motion } from 'framer-motion';
import { Brain, Users, Utensils, ShoppingCart, RefreshCw, ChefHat, Mic, Heart } from "lucide-react";

export function About() {
  const features = [
    // Features Grid - 8 items with images
    {
      icon: <Brain className="h-5 w-5 text-primary" />,
      title: "AI-Powered Nutrition",
      description: "Personalized meal recommendations based on your dietary preferences and health goals.",
      image: "/images/salmon-asparagus.png"
    },
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      title: "Family-Focused Flexibility",
      description: "Built for households with multiple needs—accommodate allergies and picky eaters.",
      image: "/images/salmon-asparagus.png"
    },
    {
      icon: <Utensils className="h-5 w-5 text-primary" />,
      title: "Personalized Meal Planning",
      description: "Custom plans shaped by your lifestyle, schedule, and preferences.",
      image: "/images/salmon-asparagus.png"
    },
    {
      icon: <ShoppingCart className="h-5 w-5 text-primary" />,
      title: "Smart Grocery Lists & Delivery",
      description: "Generate grocery lists in one tap—automatically aligned with your plan.",
      image: "/images/salmon-asparagus.png"
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-primary" />,
      title: "Flexible Ingredient Swaps",
      description: "Easily adjust recipes for dietary needs or last-minute changes.",
      image: "/images/salmon-asparagus.png"
    },
    {
      icon: <ChefHat className="h-5 w-5 text-primary" />,
      title: "Pantry-Based Recipe Suggestions",
      description: "Make the most of what you already have with smart, satisfying ideas.",
      image: "/images/salmon-asparagus.png"
    },
    {
      icon: <Mic className="h-5 w-5 text-primary" />,
      title: "Voice-First Experience",
      description: "Talk to SavviWell to get answers and plan meals—hands-free.",
      image: "/images/salmon-asparagus.png"
    },
    {
      icon: <Heart className="h-5 w-5 text-primary" />,
      title: "Wellness Support",
      description: "Get adaptive support and gentle nudges to build healthy habits.",
      image: "/images/salmon-asparagus.png"
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="about" className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="container mx-auto">
        {/* Hero Content Section - Desktop Side by Side, Mobile Stacked */}
        <div className="bg-white rounded-xl shadow-lg max-w-6xl mx-auto mb-12 overflow-hidden">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex justify-center py-6 bg-gray-50">
              <div className="w-48 h-80 bg-gradient-to-br from-primary/20 to-primary/40 rounded-3xl flex items-center justify-center">
                <span className="text-2xl font-bold text-primary opacity-50">📱</span>
              </div>
            </div>
            <div className="p-6 pt-12 space-y-6">
              <h2 className="text-3xl font-bold text-center font-heading" style={{ color: '#399e5a' }}>Healthy Made Easy</h2>
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                Imagine a smart assistant that plans healthy meals, orders your groceries, suggests recipes from what you already have, orders or lines up food delivery when you're too busy to cook.
              </p>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed text-center">
                <strong>SavviWell is your voice-guided partner in healthy living</strong>, built for real families and individuals navigating real life. It's more than meal planning. It's personalized support that grows with you, lightens the mental load, and helps you stay well without overthinking it.
              </p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 mt-8 font-heading" style={{ color: '#399e5a' }}>Healthy Made Easy</h2>
          </div>
          <div className="hidden md:grid md:grid-cols-2 md:gap-8 md:items-center">
            <div className="p-8 space-y-6">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Imagine a smart assistant that plans healthy meals, orders your groceries, suggests recipes from what you already have, orders or lines up food delivery when you're too busy to cook.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                <strong>SavviWell is your voice-guided partner in healthy living</strong>, built for real families and individuals navigating real life. It's more than meal planning. It's personalized support that grows with you, lightens the mental load, and helps you stay well without overthinking it.
              </p>
            </div>
            <div className="flex justify-center items-center p-8 bg-gray-50">
              <div className="w-64 h-96 bg-gradient-to-br from-primary/20 to-primary/40 rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-primary opacity-50">📱</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Features Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  {feature.icon}
                  <h3 className="text-base font-semibold text-gray-900 font-heading">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Stacked Cards with Overlay Effect */}
        <div className="md:hidden">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="sticky bg-white shadow-lg rounded-lg p-6 mb-4 border border-gray-200"
              style={{
                top: "20px",
                zIndex: 1,
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">{feature.title}</h3>
              <p className="text-neutral-dark">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}