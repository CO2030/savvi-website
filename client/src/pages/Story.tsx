
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";

export default function Story() {
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
        <title>Our Story - SavviWell</title>
        <meta name="description" content="Learn about SavviWell's journey to revolutionize nutrition and wellness through AI-powered personalized recommendations." />
        <meta property="og:title" content="Our Story - SavviWell" />
        <meta property="og:description" content="Learn about SavviWell's journey to revolutionize nutrition and wellness through AI-powered personalized recommendations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://savviwell.com/story" />
      </Helmet>

      <Header onWaitlistClick={openModal} />
      
      <main className="font-sans pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 font-heading">
              Our Story
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <div className="bg-gray-50 rounded-lg p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4 text-primary">Why We Started SavviWell</h2>
                <p className="text-gray-700 leading-relaxed">
                  In a world where nutrition advice is abundant but often contradictory, we recognized the need for 
                  personalized, science-backed guidance that adapts to each individual's unique needs, preferences, 
                  and lifestyle. SavviWell was born from the belief that everyone deserves access to nutrition 
                  recommendations that are as unique as they are.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-xl font-bold mb-3 text-primary">The Problem</h3>
                  <p className="text-gray-700">
                    Traditional nutrition advice follows a one-size-fits-all approach. What works for one person 
                    may not work for another due to differences in genetics, lifestyle, health conditions, and 
                    personal preferences.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-xl font-bold mb-3 text-primary">Our Solution</h3>
                  <p className="text-gray-700">
                    SavviWell leverages artificial intelligence to analyze individual profiles and provide 
                    personalized meal plans, grocery lists, and wellness recommendations that evolve with your journey.
                  </p>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-center">Our Mission</h2>
                <div className="bg-primary/10 rounded-lg p-8 text-center">
                  <p className="text-xl text-gray-800 font-medium leading-relaxed">
                    "To democratize personalized nutrition by making AI-powered wellness accessible to everyone, 
                    empowering individuals and families to make informed decisions about their health."
                  </p>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">What Makes Us Different</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">AI-Powered Personalization</h4>
                      <p className="text-gray-700">
                        Our advanced algorithms learn from your preferences, dietary restrictions, and health goals 
                        to provide recommendations that improve over time.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Science-Based Approach</h4>
                      <p className="text-gray-700">
                        Every recommendation is grounded in nutritional science and evidence-based research, 
                        ensuring you receive accurate and reliable guidance.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Adaptive Technology</h4>
                      <p className="text-gray-700">
                        Our platform continuously adapts to your changing needs, preferences, and lifestyle, 
                        providing relevant recommendations at every stage of your wellness journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  We're just getting started. Join our waitlist to be among the first to experience 
                  personalized nutrition that truly understands you.
                </p>
                <button 
                  onClick={openModal}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Join the Waitlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WaitlistModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
