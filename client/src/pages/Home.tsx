import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FounderPerks } from "@/components/FounderPerks";
import { About } from "@/components/About";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import { FloatingShareButton } from "@/components/FloatingShareButton";
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
        <FounderPerks />
        <About />
        <CTASection onWaitlistClick={openModal} />
      </main>
      <Footer />
      <WaitlistModal isOpen={isModalOpen} onClose={closeModal} />
      <FloatingShareButton />
    </>
  );
}
