import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Headphones, Play, Clock, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import foundersImage from "@assets/meara-christina-founders_1749580938646.png";

export default function Podcast() {
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
        <title>SavviWell Podcast | Wellbeing for Modern Life</title>
        <meta name="description" content="The Savviwell Podcast by Christina and Meara explores wellbeing for modern life through honest conversations, practical tools, and free downloadable guides to help you feel calmer, healthier, and more supported." />
        <meta property="og:title" content="SavviWell Podcast | Wellbeing for Modern Life" />
        <meta property="og:description" content="The Savviwell Podcast by Christina and Meara explores wellbeing for modern life through honest conversations, practical tools, and free downloadable guides to help you feel calmer, healthier, and more supported." />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header onWaitlistClick={openModal} />
      
      <main className="font-sans" style={{ backgroundColor: '#f5f0eb' }}>
        {/* Hero Section with Image and Text */}
        <section className="pt-28 pb-16 md:pt-32 md:pb-24 px-4" style={{ backgroundColor: '#f5f0eb' }}>
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              {/* Mobile-First Layout */}
              <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-center">

                {/* Founders Image - Mobile First */}
                <div className="flex justify-center mb-6 sm:mb-8 lg:mb-0 lg:order-2 lg:flex-shrink-0">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full overflow-hidden shadow-xl border-4 border-primary">
                    <img 
                      src={foundersImage} 
                      alt="Meara and Christina, hosts of the SavviWell Podcast" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="lg:order-1 lg:flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                    <Headphones className="w-5 h-5" />
                    <span className="font-medium">SavviWell Podcast</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2" data-testid="text-podcast-title">
                    The SavviWell Podcast
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
                    Wellbeing for Modern Life
                  </h2>
                  
                  <p className="text-lg text-gray-600 mb-4">
                    Honest conversations, practical tools, and free downloadable guides to help you feel calmer, healthier, and more supported in the life you're already living.
                  </p>
                  
                  <p className="text-lg text-gray-700 mb-8 font-medium">
                    Each episode comes with a free companion guide — simple, practical, and designed to help you take action.
                  </p>

                  <Button 
                    onClick={openModal}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transition-all transform hover:scale-105 px-8 py-4 text-lg"
                    data-testid="button-podcast-waitlist"
                  >
                    Get the Free Guides Now!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
              What to Expect
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Expert Interviews</h3>
                  <p className="text-gray-600">Conversations with nutritionists, wellness experts, and parents sharing their journeys.</p>
                </CardContent>
              </Card>
              <Card className="text-center p-6 shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Bite-Sized Episodes</h3>
                  <p className="text-gray-600">Quick, actionable tips you can listen to during your busy day.</p>
                </CardContent>
              </Card>
              <Card className="text-center p-6 shadow-lg">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Free PDF Guides</h3>
                  <p className="text-gray-600">Get a free, practical companion guide with each episode — built to help you apply what you learn.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4" style={{ backgroundColor: '#f5f0eb' }}>
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Be the First to Listen
            </h2>
            <p className="text-gray-600 mb-8">
              Join our waitlist to get notified when we launch the podcast.
            </p>
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={openModal}
              data-testid="button-podcast-cta"
            >
              Join the Waitlist
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      <WaitlistModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
