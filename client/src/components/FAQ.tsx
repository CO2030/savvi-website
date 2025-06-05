import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is SavviWell AI assistant?",
    answer: "SavviWell is an AI-powered nutrition assistant that provides personalized meal planning, smart grocery lists, and wellness support tailored to your individual needs and preferences."
  },
  {
    question: "How does the AI nutrition assistant work?",
    answer: "Our AI analyzes your dietary preferences, health goals, allergies, and lifestyle to create customized meal plans and grocery lists that evolve with your wellness journey."
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
    answer: "Yes! Our AI provides allergy-aware ingredient swaps and ensures all meal recommendations are safe for your specific dietary restrictions and allergies."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-lg text-gray-900">{item.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}