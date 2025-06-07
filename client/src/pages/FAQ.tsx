
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";
import { WaitlistModal } from "@/components/WaitlistModal";
import { useState } from "react";
import { Helmet } from "react-helmet";

export default function FAQPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>FAQ - SavviWell AI Assistant</title>
        <meta name="description" content="Frequently asked questions about SavviWell AI Assistant. Learn more about our voice-powered wellness platform." />
        <meta property="og:title" content="FAQ - SavviWell AI Assistant" />
        <meta property="og:description" content="Frequently asked questions about SavviWell AI Assistant. Learn more about our voice-powered wellness platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://savviwell.com/faq" />
        <link rel="canonical" href="https://savviwell.com/faq" />
        
        {/* JSON-LD FAQ Schema */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is the SavviWell AI Assistant?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "SavviWell is a voice-powered AI wellness assistant that helps families and individuals simplify healthy eating through personalized, nutrition-focused support. It goes beyond traditional meal planning apps by offering smart grocery lists, adaptive meal recommendations based on dietary goals, allergy-friendly swaps, and wellness guidance—tailored to your lifestyle and evolving health needs."
              }
            },
            {
              "@type": "Question",
              "name": "How does the SavviWell assistant work?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "SavviWell uses voice-powered AI to streamline your daily wellness routines. It learns your preferences, dietary needs, household dynamics, and health goals to create dynamic meal plans, generate smart grocery lists, and suggest real-time adjustments—like swaps for allergies or picky eaters."
              }
            },
            {
              "@type": "Question",
              "name": "Is Savvi Well free to use?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We're currently offering free beta access to early users. Join our waitlist to get notified when we launch and receive exclusive founder perks."
              }
            },
            {
              "@type": "Question",
              "name": "What makes SavviWell different from other nutrition apps?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "SavviWell is the first voice-activated AI meal planning assistant designed specifically to reduce the mental load of healthy eating for individuals and families."
              }
            },
            {
              "@type": "Question",
              "name": "Can the AI assistant help with food allergies?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. SavviWell offers allergy-aware meal planning by letting you set preferences for ingredients you want to avoid. Based on your input, it suggests ingredient swaps and meal ideas that align with your household's dietary restrictions."
              }
            }
          ]
        })}
        </script>
      </Helmet>

      <Header onWaitlistClick={openModal} />
      <main className="font-sans pt-20">
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-heading mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about SavviWell AI Assistant
            </p>
          </div>
        </div>
        <FAQ />
      </main>
      <Footer />
      <WaitlistModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
