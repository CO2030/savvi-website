
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is the SavviWell AI Assistant?",
    answer: "SavviWell is a voice-powered AI wellness assistant that helps families and individuals simplify healthy eating through personalized, nutrition-focused support. It goes beyond traditional meal planning apps by offering smart grocery lists, adaptive meal recommendations based on dietary goals, allergy-friendly swaps, and wellness guidance—tailored to your lifestyle and evolving health needs. Whether you're a parent juggling picky eaters or an individual working toward specific nutrition goals, SavviWell reduces the mental load and empowers long-term, sustainable wellness."
  },
  {
    question: "How does the SavviWell assistant work?",
    answer: "SavviWell uses voice-powered AI to streamline your daily wellness routines. It learns your preferences, dietary needs, household dynamics, and health goals to create dynamic meal plans, generate smart grocery lists, and suggest real-time adjustments—like swaps for allergies or picky eaters. As you interact with SavviWell, it continuously adapts to support your evolving lifestyle, making healthy choices easier and more sustainable over time."
  },
  {
    question: "Is Savvi Well free to use?",
    answer: "We're currently offering free beta access to early users. Join our waitlist to get notified when we launch and receive exclusive founder perks."
  },
  {
    question: "What makes SavviWell different from other nutrition apps?",
    answer: "SavviWell is the first voice-activated AI meal planning assistant designed specifically to reduce the mental load of healthy eating for individuals and families."
  },
  {
    question: "Can the AI assistant help with food allergies?",
    answer: "Yes. SavviWell offers allergy-aware meal planning by letting you set preferences for ingredients you want to avoid. Based on your input, it suggests ingredient swaps and meal ideas that align with your household's dietary restrictions—whether for individuals or families. While SavviWell doesn't provide medical advice, it helps simplify planning around common food sensitivities with smart, customizable recommendations."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 bg-gray-100">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <p className="text-sm text-gray-600 mb-2">You ask, we answer</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">
            Help & FAQ
          </h2>
        </div>
        
        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-300">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-200 transition-colors group"
              >
                <h3 className="font-medium text-base text-gray-900 pr-4">{item.question}</h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="w-3 h-0.5 bg-gray-700"></div>
                    </div>
                  ) : (
                    <div className="w-5 h-5 flex items-center justify-center relative">
                      <div className="w-3 h-0.5 bg-gray-700"></div>
                      <div className="w-0.5 h-3 bg-gray-700 absolute"></div>
                    </div>
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
