
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Helmet } from "react-helmet";

export default function PrivacyPolicy() {
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
        <title>Privacy Policy - SavviWell</title>
        <meta name="description" content="SavviWell's Privacy Policy - Learn how we collect, use, and protect your personal data." />
      </Helmet>
      
      <Header onWaitlistClick={openModal} />
      <main className="font-sans pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 font-heading">SavviWell Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6 text-neutral-dark">
              <strong>Effective Date:</strong> May 20, 2025
            </p>
            
            <p className="mb-6">
              SavviWell Inc. ("SavviWell", "we", "us", or "our") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your personal data when you 
              join our waitlist or interact with us online.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">1. What We Collect:</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name (optional)</li>
                <li>Email address</li>
                <li>Technical info (IP address, browser, etc.)</li>
                <li>Feedback or voluntary submissions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">2. Why We Collect It:</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To notify you about launch updates</li>
                <li>To understand user interest</li>
                <li>To personalize communication</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">3. Legal Basis:</h2>
              <p>
                We process data based on consent, legitimate interest, or legal obligation depending on 
                your region (e.g., GDPR, CCPA).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">4. Third Parties:</h2>
              <p>
                We use trusted services (e.g., Google Analytics, Hubspot) for waitlist management and 
                site performance. Your data is not sold or shared for marketing purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">5. Data Rights:</h2>
              <p>
                You may access, correct, or request deletion of your data by contacting{" "}
                <a href="mailto:savviwell@gmail.com" className="text-primary hover:underline">
                  savviwell@gmail.com
                </a>
                . You can unsubscribe at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">6. Security:</h2>
              <p>
                We use secure cloud infrastructure with access controls and encryption. No system is 
                100% secure, but we follow best practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">7. Retention:</h2>
              <p>
                We retain data only as long as needed for the purpose it was collected.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">8. Updates:</h2>
              <p>
                We may revise this policy and will post changes on our site. Continued use after 
                updates implies acceptance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">Contact:</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-semibold">SavviWell Privacy Officer</p>
                <p>
                  Email:{" "}
                  <a href="mailto:savviwell@gmail.com" className="text-primary hover:underline">
                    savviwell@gmail.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <WaitlistModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
