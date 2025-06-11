import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FounderPerks } from "@/components/FounderPerks";
import { About } from "@/components/About";

import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Helmet } from "react-helmet";

export default function Home() {
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
        <title>SavviWell - Smarter meals. Healthier lives.</title>
        <meta name="description" content="SavviWell is an AI-powered nutrition and wellness platform for individuals and families. Join our waitlist today!" />
        <meta property="og:title" content="SavviWell - Smarter meals. Healthier lives." />
        <meta property="og:description" content="SavviWell is an AI-powered nutrition and wellness platform for individuals and families. Join our waitlist today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://savviwell.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </Helmet>

      <Header onWaitlistClick={openModal} />
      <main className="font-sans">
        <Hero onWaitlistClick={openModal} />
        <About />
        
        {/* Meet SavviWell's Founders Section */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 font-heading">Meet SavviWell's Founders</h2>
              
              {/* Founders Photo */}
              <div className="flex justify-center mb-6">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-xl border-4 border-primary">
                  <img 
                    src="/attached_assets/meara-christina-founders_1749580938646.png" 
                    alt="Meara and Christina, co-founders of SavviWell" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Founders Label */}
              <p className="text-lg font-semibold text-primary mb-8">Founders</p>
              
              {/* Content */}
              <div className="space-y-6 mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  Ready to stop juggling and feel supported?
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  We're two moms who built the tool we wished we had. Read our story and see how SavviWell can simplify your every day—and give you more time for what really matters.
                </p>
              </div>
              
              {/* Read More Button */}
              <a href="/story">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg transition-all transform hover:scale-105 px-8 py-4 text-lg"
                >
                  Read More
                </Button>
              </a>
            </div>
          </div>
        </section>

        <FounderPerks />
        <CTASection onWaitlistClick={openModal} />
      </main>
      <Footer />
      <WaitlistModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}