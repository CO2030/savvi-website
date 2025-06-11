import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Button } from "@/components/ui/button";
import foundersImage from "@assets/meara-christina-founders_1749580938646.png";

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
          className="story-hero relative"
          style={{
            backgroundImage: "url('/images/story-hero.jpeg')"
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 font-heading">Our Story</h2>

              {/* Mobile-First Layout */}
              <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-start">

                {/* Founders Image - Mobile First */}
                <div className="flex justify-center mb-6 sm:mb-8 lg:mb-0 lg:order-2 lg:flex-shrink-0">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full overflow-hidden shadow-xl border-2 sm:border-3 md:border-4 border-primary">
                    <img 
                      src={foundersImage} 
                      alt="Meara and Christina, co-founders of SavviWell" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Story Text - Organized in flowing sections */}
                <div className="lg:order-1 lg:flex-1">

                  {/* Opening */}
                  <div className="bg-primary/5 rounded-xl p-6 mb-6">
                    <p className="text-lg text-gray-700 leading-relaxed font-medium">
                      We started SavviWell because we knew there had to be a <strong>better way</strong>.
                    </p>
                  </div>

                  {/* The Problem */}
                  <div className="space-y-4 mb-8">
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      A way to feed our families without the constant stress, the endless decisions, and the mental juggling act that starts before breakfast and doesn't stop.
                    </p>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      We're both moms, from very different backgrounds—one of us from wellness, the other from early-stage startups—but we shared the same struggle:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary">
                      <p className="text-base md:text-lg text-gray-700 leading-relaxed italic">
                        "The daily question of what to cook, what to buy, who's eating what, and how to make it all work with limited time and energy."
                      </p>
                    </div>
                  </div>

                  {/* The Deeper Issue */}
                  <div className="space-y-4 mb-8">
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      It wasn't just about meals. It was about <em>everything</em> around the meals—
                    </p>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-300">
                      Dietary needs, grocery lists, last-minute store runs, figuring out delivery, remembering to defrost something, and hoping it's what everyone wants to eat.
                    </p>
                  </div>

                  {/* The Solution */}
                  <div className="space-y-4 mb-8">
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      We didn't need another app to give us more options.
                    </p>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      We needed a system that could <strong>take the weight off</strong>—one that helped us plan better, shop smarter, and nourish our families (and ourselves) without burning out.
                    </p>
                  </div>

                  {/* What SavviWell Is */}
                  <div className="bg-primary/10 rounded-xl p-6 mb-8">
                    <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-semibold mb-4">
                      That's what SavviWell is.
                    </p>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      A supportive, thoughtful tool that simplifies food planning, grocery lists, and delivery—while making space for wellness in the midst of real life.
                    </p>
                  </div>

                  {/* The Vision */}
                  <div className="text-center space-y-3 mb-8">
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      Because this isn't just about food.
                    </p>
                    <p className="text-lg md:text-xl font-semibold text-primary">
                      It's about creating space.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base text-gray-600">
                      <span className="bg-white px-3 py-1 rounded-full shadow-sm">For connection</span>
                      <span className="bg-white px-3 py-1 rounded-full shadow-sm">For care</span>
                      <span className="bg-white px-3 py-1 rounded-full shadow-sm">For calm</span>
                      <span className="bg-white px-3 py-1 rounded-full shadow-sm">For daily wellness that feels doable</span>
                    </div>
                  </div>

                  {/* Closing */}
                  <div className="text-center">
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                      We built the tool we desperately wished we had—<br/>
                      and now we're building it for all of us.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 inline-block">
                      <p className="text-base md:text-lg text-gray-800 font-semibold italic">
                        — Meara and Christina<br/>
                        <span className="text-primary text-sm font-normal">Co-Founders, SavviWell</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-6 mb-6">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    We started SavviWell because we knew there had to be a better way.
                  </p>

                  <div className="flex justify-center mb-6">
                    <Button 
                      onClick={openModal}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg transition-all transform hover:scale-105 px-8 py-4 text-lg"
                    >
                      Join the Waitlist
                    </Button>
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
              className="bg-primary hover:bg-primary/70 text-white font-bold shadow-lg transition-all transform hover:scale-105 px-8 py-4 text-lg md:text-xl"
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