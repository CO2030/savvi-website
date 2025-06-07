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
        <div className="bg-white rounded-xl shadow-lg max-w-7xl mx-auto mb-16 overflow-hidden">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex justify-center py-8 bg-gray-50">
              <div className="w-80 h-60 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="/images/salmon-asparagus.png" 
                  alt="Delicious salmon with asparagus - healthy meal example" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="p-6 pt-8 space-y-6">
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
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 mt-12 font-heading" style={{ color: '#399e5a' }}>Healthy Made Easy</h2>
          </div>
          <div className="hidden md:grid md:grid-cols-2 md:gap-16 md:items-center">
            <div className="p-12 space-y-8">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                Imagine a smart assistant that plans healthy meals, orders your groceries, suggests recipes from what you already have, orders or lines up food delivery when you're too busy to cook.
              </p>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                <strong>SavviWell is your voice-guided partner in healthy living</strong>, built for real families and individuals navigating real life. It's more than meal planning. It's personalized support that grows with you, lightens the mental load, and helps you stay well without overthinking it.
              </p>
            </div>
            <div className="flex justify-end items-center p-8 bg-gray-50">
              <div className="w-80 h-64 lg:w-96 lg:h-72 xl:w-[420px] xl:h-80 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="/images/salmon-asparagus.png" 
                  alt="Delicious salmon with asparagus - healthy meal example" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Cards Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 font-heading text-gray-900">Why Choose SavviWell?</h3>

          {/* Desktop Feature Cards Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:border-primary/20"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 font-heading">{feature.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile Feature Cards */}
          <div className="md:hidden space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 font-heading">{feature.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}