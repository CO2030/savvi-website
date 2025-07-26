import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Clock, Users, ShoppingCart, Utensils } from "lucide-react";

const mealPlans = [
  {
    day: 1,
    title: "Mediterranean Salmon Bowl",
    prepTime: "25 mins",
    servings: "4",
    ingredients: [
      "4 salmon fillets (6oz each)",
      "2 cups quinoa",
      "1 cucumber, diced",
      "2 cups cherry tomatoes",
      "1 red onion, sliced",
      "1/2 cup kalamata olives",
      "1/4 cup feta cheese",
      "3 tbsp olive oil",
      "2 lemons",
      "Fresh dill"
    ],
    instructions: [
      "Cook quinoa according to package directions",
      "Season salmon with salt, pepper, and lemon juice",
      "Heat olive oil in pan, cook salmon 4-5 minutes per side",
      "Mix cucumber, tomatoes, onion, and olives",
      "Serve salmon over quinoa with vegetables and feta"
    ]
  },
  {
    day: 2,
    title: "Asian Chicken Lettuce Wraps",
    prepTime: "20 mins",
    servings: "4",
    ingredients: [
      "1 lb ground chicken",
      "1 head butter lettuce",
      "2 carrots, julienned",
      "1 red bell pepper, diced",
      "3 green onions, sliced",
      "2 tbsp sesame oil",
      "3 tbsp soy sauce",
      "1 tbsp rice vinegar",
      "2 cloves garlic, minced",
      "1 tsp fresh ginger"
    ],
    instructions: [
      "Heat sesame oil in large pan",
      "Cook ground chicken until no longer pink",
      "Add garlic and ginger, cook 1 minute",
      "Stir in soy sauce and rice vinegar",
      "Add vegetables, cook 3-4 minutes until crisp-tender",
      "Serve in lettuce cups with green onions"
    ]
  },
  {
    day: 3,
    title: "One-Pan Vegetable Pasta",
    prepTime: "30 mins",
    servings: "4",
    ingredients: [
      "12 oz whole grain penne",
      "2 zucchini, sliced",
      "1 yellow bell pepper",
      "1 cup cherry tomatoes",
      "1/2 red onion, sliced",
      "3 cloves garlic, minced",
      "1/4 cup olive oil",
      "1/2 cup fresh basil",
      "1/4 cup parmesan cheese",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook pasta according to package directions",
      "Heat olive oil in large pan",
      "Sauté onion and garlic until fragrant",
      "Add zucchini and bell pepper, cook 5 minutes",
      "Add tomatoes, cook until softened",
      "Toss with cooked pasta, basil, and parmesan"
    ]
  },
  {
    day: 4,
    title: "Turkey and Sweet Potato Skillet",
    prepTime: "35 mins",
    servings: "4",
    ingredients: [
      "1 lb ground turkey",
      "2 large sweet potatoes, cubed",
      "1 bell pepper, diced",
      "1 onion, diced",
      "2 cups spinach",
      "2 tbsp olive oil",
      "1 tsp cumin",
      "1 tsp paprika",
      "1/2 tsp garlic powder",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Heat olive oil in large skillet",
      "Cook sweet potato cubes until tender, about 15 minutes",
      "Add onion and bell pepper, cook 5 minutes",
      "Add ground turkey and spices, cook until browned",
      "Stir in spinach until wilted",
      "Season with salt and pepper to taste"
    ]
  },
  {
    day: 5,
    title: "Baked Cod with Roasted Vegetables",
    prepTime: "40 mins",
    servings: "4",
    ingredients: [
      "4 cod fillets (6oz each)",
      "2 cups broccoli florets",
      "2 cups Brussels sprouts, halved",
      "1 lb baby potatoes, halved",
      "3 tbsp olive oil",
      "2 lemons",
      "2 cloves garlic, minced",
      "1 tsp dried herbs",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 425°F",
      "Toss vegetables with olive oil, salt, and pepper",
      "Roast vegetables for 20 minutes",
      "Season cod with lemon juice, garlic, and herbs",
      "Add cod to pan with vegetables",
      "Bake additional 12-15 minutes until fish flakes easily"
    ]
  }
];

const shoppingList = {
  "Proteins": [
    "4 salmon fillets (6oz each)",
    "1 lb ground chicken",
    "1 lb ground turkey", 
    "4 cod fillets (6oz each)"
  ],
  "Vegetables": [
    "2 cups quinoa",
    "1 head butter lettuce",
    "2 cucumbers",
    "4 cups cherry tomatoes",
    "2 red onions",
    "2 zucchini",
    "2 yellow bell peppers",
    "1 red bell pepper",
    "2 carrots",
    "3 green onions",
    "2 cups broccoli florets",
    "2 cups Brussels sprouts",
    "1 lb baby potatoes",
    "2 large sweet potatoes",
    "2 cups spinach"
  ],
  "Pantry Items": [
    "12 oz whole grain penne",
    "Olive oil",
    "Sesame oil",
    "Soy sauce",
    "Rice vinegar",
    "Kalamata olives",
    "Feta cheese",
    "Parmesan cheese",
    "Fresh herbs (basil, dill)",
    "Garlic",
    "Lemons",
    "Spices (cumin, paprika, dried herbs)"
  ]
};

export default function MealGuide() {
  const handleDownloadPDF = () => {
    // Download the actual SavviWell PDF
    const a = document.createElement('a');
    a.href = '/api/download-meal-guide';
    a.download = 'SavviWell-5-Day-Meals.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const generatePDFContent = () => {
    let content = `SAVVIWELL 5-DAY HEALTHY MEALS GUIDE
========================================

Welcome to your personalized 5-day dinner planning guide! Each recipe is designed to be nutritious, delicious, and family-friendly.

MEAL PLANS
==========

`;

    mealPlans.forEach((meal) => {
      content += `DAY ${meal.day}: ${meal.title.toUpperCase()}
Prep Time: ${meal.prepTime} | Servings: ${meal.servings}

INGREDIENTS:
${meal.ingredients.map(ing => `• ${ing}`).join('\n')}

INSTRUCTIONS:
${meal.instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

---

`;
    });

    content += `COMPLETE SHOPPING LIST
=====================

${Object.entries(shoppingList).map(([category, items]) => 
  `${category.toUpperCase()}:\n${items.map(item => `• ${item}`).join('\n')}`
).join('\n\n')}

MEAL PREP TIPS
==============

• Wash and chop vegetables on Sunday for the week
• Cook quinoa in batches and store in refrigerator
• Marinate proteins the night before for enhanced flavor
• Pre-cut vegetables and store in airtight containers
• Keep herbs fresh by storing in water like flowers

NUTRITION TIPS
==============

• Each meal provides balanced protein, healthy fats, and complex carbs
• Aim for colorful plates - variety ensures diverse nutrients
• Stay hydrated with water throughout the day
• Listen to your body's hunger and fullness cues
• Enjoy your meals mindfully without distractions

Thank you for choosing SavviWell!
Visit us at savviwell.com for more healthy living resources.
`;

    return content;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Your FREE <span style={{ color: '#399E5A' }}>5-Day Healthy Meals</span> Guide
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Complete dinner plans designed to make healthy eating effortless for your family
          </p>
          <Button 
            onClick={handleDownloadPDF}
            className="text-white px-8 py-3 text-lg hover:opacity-90 transition-opacity duration-200"
            style={{ backgroundColor: '#399E5A' }}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Complete Guide (PDF)
          </Button>
        </div>

        {/* Meal Plans */}
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {mealPlans.map((meal) => (
            <Card key={meal.day} className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-gray-800">Day {meal.day}</CardTitle>
                    <h3 className="text-xl font-semibold mt-2" style={{ color: '#399E5A' }}>
                      {meal.title}
                    </h3>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-4 h-4" />
                      {meal.prepTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {meal.servings}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Ingredients
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {meal.ingredients.slice(0, 6).map((ingredient, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-xs mt-1">•</span>
                          {ingredient}
                        </li>
                      ))}
                      {meal.ingredients.length > 6 && (
                        <li className="text-xs text-gray-500 italic">
                          + {meal.ingredients.length - 6} more ingredients...
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Utensils className="w-4 h-4" />
                      Quick Steps
                    </h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                      {meal.instructions.slice(0, 3).map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-medium text-xs mt-1">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                      {meal.instructions.length > 3 && (
                        <li className="text-xs text-gray-500 italic">
                          + {meal.instructions.length - 3} more steps in full guide...
                        </li>
                      )}
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shopping List Preview */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" style={{ color: '#399E5A' }} />
              Complete Shopping List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(shoppingList).map(([category, items]) => (
                <div key={category}>
                  <h4 className="font-semibold text-gray-800 mb-3">{category}</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {items.slice(0, 5).map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" style={{ color: '#399E5A' }} />
                        {item}
                      </li>
                    ))}
                    {items.length > 5 && (
                      <li className="text-xs text-gray-500 italic">
                        + {items.length - 5} more items...
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="shadow-lg border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Transform Your Family's Health?
              </h3>
              <p className="text-gray-600 mb-6">
                This is just the beginning! Get early access to our AI nutrition assistant for personalized meal planning and health guidance.
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="text-white px-8 py-3 text-lg hover:opacity-90 transition-opacity duration-200"
                style={{ backgroundColor: '#399E5A' }}
              >
                Explore SavviWell Platform
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}