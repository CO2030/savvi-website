
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

        {/* Our Story Section */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading">Our Story</h2>
              
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                {/* Story Text */}
                <div className="space-y-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We started SavviWell because we knew there had to be a better way.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    A way to feed our families without the constant stress, the endless decisions, and the mental juggling act that starts before breakfast and doesn't stop.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We're both moms, from very different backgrounds—one of us from wellness, the other from early-stage startups—but we shared the same struggle:
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    The daily question of what to cook, what to buy, who's eating what, and how to make it all work with limited time and energy.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    It wasn't just about meals. It was about everything around the meals—
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Dietary needs, grocery lists, last-minute store runs, figuring out delivery, remembering to defrost something, and hoping it's what everyone wants to eat.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We didn't need another app to give us more options.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We needed a system that could take the weight off—one that helped us plan better, shop smarter, and nourish our families (and ourselves) without burning out.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    That's what SavviWell is.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    A supportive, thoughtful tool that simplifies food planning, grocery lists, and delivery—while making space for wellness in the midst of real life.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Because this isn't just about food.<br/>
                    It's about creating space.<br/>
                    For connection.<br/>
                    For care.<br/>
                    For calm.<br/>
                    For daily wellness that feels doable.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We built the tool we desperately wished we had—<br/>
                    and now we're building it for all of us.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed font-semibold italic">
                    — Meara and Christina,<br/>
                    Co-Founders, SavviWell
                  </p>
                </div>

                {/* Founders Image */}
                <div className="flex justify-center">
                  <div className="w-80 h-96 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                    {/* Placeholder for founders image */}
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary opacity-50">Meara & Christina</span>
                    </div>
                  </div>
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
