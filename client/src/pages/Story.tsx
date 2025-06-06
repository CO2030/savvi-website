
import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Button } from "@/components/ui/button";

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
      
      <main className="font-sans">
        {/* Hero Section */}
        <section 
          className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 flex items-center min-h-[70vh] bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-background.jpeg')"
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading">
                Our Story
              </h1>
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                Born from the everyday struggles of meal planning and wellness, SavviWell is building the future of personalized nutrition through AI.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-16 md:py-24 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 font-heading">Our Mission</h2>
              <div className="bg-primary/10 rounded-2xl p-8 md:p-12">
                <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-6">
                  "To democratize personalized nutrition by making AI-powered wellness accessible to everyone, empowering individuals and families to make informed decisions about their health."
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We believe that nutrition advice shouldn't be one-size-fits-all. Every family has unique needs, preferences, and challenges. Our mission is to create technology that understands these differences and provides personalized support that grows with you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading">Meet Our Founders</h2>
              
              <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                {/* Founder 1 */}
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {/* Placeholder for founder image */}
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <span className="text-6xl font-bold text-primary opacity-50">F1</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 font-heading">Founder Name</h3>
                  <p className="text-primary font-semibold mb-4">Co-Founder & CEO</p>
                  <p className="text-gray-700 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Passionate about making nutrition accessible to all families.
                  </p>
                </div>

                {/* Founder 2 */}
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {/* Placeholder for founder image */}
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <span className="text-6xl font-bold text-primary opacity-50">F2</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 font-heading">Founder Name</h3>
                  <p className="text-primary font-semibold mb-4">Co-Founder & CTO</p>
                  <p className="text-gray-700 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Expert in AI and machine learning technologies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section 
          className="relative py-16 px-4 text-white" 
          style={{
            backgroundImage: "url('/images/hero-background.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Join Our Journey</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              We're just getting started. Be among the first to experience personalized nutrition that truly understands you and your family's unique needs.
            </p>
            <Button 
              onClick={openModal}
              size="lg"
              className="bg-primary hover:bg-primary/70 text-white font-bold shadow-lg transition-all transform hover:scale-105 px-8 py-4 text-lg"
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
