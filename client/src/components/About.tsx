import { Brain, Users, ShoppingBasket, ChefHat, RefreshCw, UtensilsCrossed, Mic } from "lucide-react";

export function About() {
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: "AI-Powered Nutrition",
      description: "Personalized meal recommendations based on your dietary preferences, health goals, and real-life needs."
    },
    {
      icon: <Users className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: "Family-Focused Flexibility",
      description: "Built for households with multiple needs—accommodate allergies, picky eaters, and unique goals with ease."
    },
    {
      icon: <ChefHat className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: "Personalized Meal Planning",
      description: "Custom plans shaped by your lifestyle, schedule, and preferences—from quick comfort meals to clean eating."
    },
    {
      icon: <ShoppingBasket className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: "Smart Grocery Lists & Delivery",
      description: "Generate grocery lists in one tap—automatically aligned with your plan and pantry, ready to send to delivery partners."
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: "Flexible Ingredient Swaps",
      description: "Easily adjust recipes for dietary needs, last-minute changes, or mood-based cravings—without the stress."
    },
    {
      icon: <UtensilsCrossed className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: "Pantry-Based Recipe Suggestions",
      description: "Make the most of what you already have. No more endless scrolling—just smart, satisfying ideas."
    },
    {
      icon: <Mic className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: "Voice-First, Hands-Free Experience",
      description: "Talk to SavviWell to get answers, plan your next meal, or change course—without lifting a finger."
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="container mx-auto">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Your Voice AI Assistant for Everyday Life</h2>
            <p className="text-lg mb-6 text-neutral-dark">
              <strong>Imagine having someone who just <em>gets it</em>.</strong>
            </p>
            <p className="text-lg mb-6 text-neutral-dark">
              The never-ending meal planning. The picky eaters. The special diets. The 5:45pm panic: <em>"What are we eating tonight?"</em>
            </p>
            <p className="text-lg mb-6 text-neutral-dark">
              Now imagine your <strong>AI assistant</strong> already has the answer—one that fits your goals, your groceries, and your time.
            </p>
            <p className="text-lg mb-6 text-neutral-dark">
              <strong>SavviWell is your voice-guided partner in healthy living,</strong> built for real families and individuals navigating real life. It's more than meal planning. It's personalized support that grows with you, lightens the mental load, and helps you stay well without overthinking it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="/images/salmon-asparagus.png" 
              alt="Roasted salmon with potatoes and asparagus - healthy one-pan meal" 
              className="rounded-lg shadow-md h-48 md:h-auto object-cover w-full"
            />
            <img 
              src="https://images.unsplash.com/photo-1484980972926-edee96e0960d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=700" 
              alt="Fresh healthy ingredients" 
              className="rounded-lg shadow-md mt-6 h-48 md:h-auto object-cover w-full" 
            />
            <img 
              src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=700" 
              alt="Fresh vegetables arranged on a table" 
              className="rounded-lg shadow-md h-48 md:h-auto object-cover w-full" 
            />
            <img 
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=700" 
              alt="Person preparing healthy meal" 
              className="rounded-lg shadow-md mt-6 h-48 md:h-auto object-cover w-full" 
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 font-heading">Key Features</h3>
          <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
            Discover the powerful features that make SavviWell your perfect kitchen companion
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-bold mb-2 font-heading text-gray-900 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-dark leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
