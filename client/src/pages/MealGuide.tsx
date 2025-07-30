import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Clock, Users, ShoppingCart, Utensils, Share2, Copy } from "lucide-react";
import { ReferralSection } from "@/components/ReferralSection";
import freshVegetablesImage from "@/assets/images/fresh-vegetables.png";
import vegetablesAssortmentImage from "@/assets/images/vegetables-assortment.png";

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
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);
  
  useEffect(() => {
    // Get token from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
      setIsValidToken(false);
      return;
    }
    
    // Verify token with backend
    fetch(`/api/verify-access?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setIsValidToken(true);
          setUserName(data.name || 'Friend');
          setUserEmail(data.email || '');
        } else {
          setIsValidToken(false);
        }
      })
      .catch(() => setIsValidToken(false));
  }, []);
  
  // Show loading state
  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#399E5A' }}></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  // Sharing functions
  const handleShare = async (platform: string) => {
    const shareUrl = `${window.location.origin}/5-day-meals`;
    const shareText = "Check out this FREE 5-Day Healthy Meals Guide from SavviWell! Perfect for busy families who want nutritious, delicious dinners.";
    
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    }
  };

  // Show access denied
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image Section */}
          <div className="mb-8">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={vegetablesAssortmentImage} 
                    alt="Colorful assortment of fresh vegetables on wooden background" 
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Want Your <span style={{ color: '#399E5A' }}>FREE</span> 5-Day Meal Guide?
                      </h1>
                      <p className="text-xl md:text-2xl opacity-90">
                        Join thousands of families getting healthy, delicious meals delivered straight to their inbox!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Card */}
          <Card className="w-full max-w-3xl mx-auto text-center shadow-2xl border-0 overflow-hidden">
            <div className="h-2" style={{ backgroundColor: '#399E5A' }}></div>
            <CardContent className="p-8 md:p-12">
              <div className="mb-8">
                {/* SavviWell Logo/Brand */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#399E5A' }}>
                  <Utensils className="w-12 h-12 text-white" />
                </div>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Transform your family's health with nutritious meals they'll actually love!
                </p>
              </div>
              
              <div className="space-y-6">
                <Button 
                  onClick={() => window.location.href = '/5-day-meals'}
                  className="text-white px-12 py-4 text-xl font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg w-full md:w-auto"
                  style={{ backgroundColor: '#399E5A' }}
                >
                  Get My Free Meal Guide Now
                </Button>
                
                <p className="text-sm text-gray-500">
                  No spam, just delicious family meals created by certified nutritionists
                </p>

                {/* Share Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Share with Friends & Family</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button 
                      onClick={() => handleShare('copy')}
                      variant="outline"
                      className="flex items-center gap-2"
                      style={{ borderColor: '#399E5A', color: '#399E5A' }}
                    >
                      <Copy className="w-4 h-4" />
                      {copySuccess ? 'Copied!' : 'Copy Link'}
                    </Button>
                    <Button 
                      onClick={() => handleShare('facebook')}
                      variant="outline"
                      className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <Share2 className="w-4 h-4" />
                      Facebook
                    </Button>
                    <Button 
                      onClick={() => handleShare('twitter')}
                      variant="outline"
                      className="flex items-center gap-2 text-blue-400 border-blue-400 hover:bg-blue-50"
                    >
                      <Share2 className="w-4 h-4" />
                      Twitter
                    </Button>
                    <Button 
                      onClick={() => handleShare('whatsapp')}
                      variant="outline"
                      className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <Share2 className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
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
            Hi {userName}! Your FREE <span style={{ color: '#399E5A' }}>5-Day Healthy Meals</span> Guide
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

        {/* Hero Image Section */}
        <div className="mb-12">
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={freshVegetablesImage} 
                  alt="Fresh organic vegetables including broccoli, tomatoes, carrots, and peppers" 
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Fresh, Wholesome Ingredients</h2>
                    <p className="text-lg md:text-xl opacity-90">Every recipe uses simple, nutritious ingredients your family will love</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What's Included Preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-lg border-0 text-center">
            <CardContent className="p-6">
              <Utensils className="w-12 h-12 mx-auto mb-4" style={{ color: '#399E5A' }} />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5 Complete Recipes</h3>
              <p className="text-gray-600">Nutritious dinner plans designed by certified nutritionists</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 text-center">
            <CardContent className="p-6">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4" style={{ color: '#399E5A' }} />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Shopping Lists</h3>
              <p className="text-gray-600">Organized grocery lists to make shopping effortless</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 text-center">
            <CardContent className="p-6">
              <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: '#399E5A' }} />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Prep & Wellness Tips</h3>
              <p className="text-gray-600">Time-saving meal prep strategies and wellness guidance</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Meals Preview */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">What's Inside Your Guide</CardTitle>
            <p className="text-gray-600 mt-2">5 delicious, family-friendly meals created by certified nutritionists</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mealPlans.slice(0, 5).map((meal) => (
                <div key={meal.day} className="text-center p-4 rounded-lg" style={{ backgroundColor: '#f8fffe' }}>
                  <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#399E5A' }}>
                    {meal.day}
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">{meal.title}</h4>
                  <p className="text-sm text-gray-500">{meal.prepTime} • {meal.servings}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Referral Section */}
        {userEmail && (
          <div className="mb-12">
            <ReferralSection userEmail={userEmail} userName={userName} />
          </div>
        )}

        {/* Call to Action & Share */}
        <div className="text-center space-y-8">
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

          {/* Share This Guide */}
          <Card className="shadow-lg border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Love This Guide? Share It!
              </h3>
              <p className="text-gray-600 mb-6">
                Help other families discover healthy eating with our FREE 5-Day Meal Guide
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  onClick={() => handleShare('copy')}
                  variant="outline"
                  className="flex items-center gap-2"
                  style={{ borderColor: '#399E5A', color: '#399E5A' }}
                >
                  <Copy className="w-4 h-4" />
                  {copySuccess ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button 
                  onClick={() => handleShare('facebook')}
                  variant="outline"
                  className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <Share2 className="w-4 h-4" />
                  Facebook
                </Button>
                <Button 
                  onClick={() => handleShare('twitter')}
                  variant="outline"
                  className="flex items-center gap-2 text-blue-400 border-blue-400 hover:bg-blue-50"
                >
                  <Share2 className="w-4 h-4" />
                  Twitter
                </Button>
                <Button 
                  onClick={() => handleShare('whatsapp')}
                  variant="outline"
                  className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Share2 className="w-4 h-4" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}