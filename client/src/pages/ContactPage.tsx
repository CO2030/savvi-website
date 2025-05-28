
import { Header } from "@/components/Header";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Helmet } from "react-helmet";

export default function ContactPage() {
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
        <title>Contact Us - SavviWell</title>
        <meta name="description" content="Get in touch with SavviWell. We'd love to hear from you about our AI-powered nutrition platform." />
      </Helmet>
      
      <Header onWaitlistClick={openModal} />
      <main className="font-sans">
        <Contact />
      </main>
      <Footer />
      <WaitlistModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
