import { Brain, Users, ShoppingBasket } from "lucide-react";

export function About() {
  const features = [
    {
      icon: <Brain className="text-primary" aria-hidden="true" />,
      title: "AI-Powered Nutrition",
      description: "Personalized meal recommendations based on your dietary preferences and health goals."
    },
    {
      icon: <Users className="text-primary" aria-hidden="true" />,
      title: "Family-Focused",
      description: "Tools designed for households with diverse nutritional needs and preferences."
    },
    {
      icon: <ShoppingBasket className="text-primary" aria-hidden="true" />,
      title: "Smart Grocery Lists",
      description: "Automatically generated shopping lists based on your meal plans to save time and reduce waste."
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Your Voice AI Assistant for Everyday Life</h2>
            <p className="text-lg mb-6 text-neutral-dark">
              Imagine having someone who just gets it.
            </p>
            <p className="text-lg mb-6 text-neutral-dark">
              The never-ending meal planning. The picky eaters. The special diets. The 5:45pm panic: "What are we eating tonight?"
            </p>
            <p className="text-lg mb-6 text-neutral-dark">
              Now imagine your AI assistant already has the answer—one that fits your goals, your groceries, and your time.
            </p>
            <p className="text-lg mb-6 text-neutral-dark">
              SavviWell is your voice-guided partner in healthy living, built for real families and individuals navigating real life. It's more than meal planning. It's personalized support that grows with you, lightens the mental load, and helps you stay well without overthinking it.
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 font-heading">{feature.title}</h3>
                    <p className="text-neutral-dark">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
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
      </div>
    </section>
  );
}
