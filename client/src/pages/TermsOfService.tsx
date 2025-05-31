
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Helmet } from "react-helmet";

export default function TermsOfService() {
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
        <title>Terms of Service - SavviWell</title>
        <meta name="description" content="SavviWell's Terms of Service - Learn about the terms and conditions for using our services." />
      </Helmet>
      
      <Header onWaitlistClick={openModal} />
      <main className="font-sans pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 font-heading">SavviWell Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6 text-neutral-dark">
              <strong>Effective Date:</strong> May 20, 2025
            </p>
            
            <p className="mb-6">
              By using SavviWell services or joining our waitlist, you agree to the following terms.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">1. Pre-Launch Nature:</h2>
              <p>
                SavviWell is in development. Access to the waitlist does not guarantee future use of 
                the platform or services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">2. Communications:</h2>
              <p>
                By signing up, you consent to receive email updates. You may opt out at any time via 
                the unsubscribe link or by contacting us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">3. Acceptable Use:</h2>
              <p>
                You agree not to misuse the site, exploit the waitlist system, or distribute any 
                content from SavviWell without permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">4. Intellectual Property:</h2>
              <p>
                All content and materials remain the property of SavviWell and may not be reused 
                without written consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">5. Limitation of Liability:</h2>
              <p>
                SavviWell is not responsible for any indirect damages or losses resulting from use 
                or inability to use our pre-release services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">6. Modifications:</h2>
              <p>
                We reserve the right to update these terms at any time. Continued use indicates 
                your acceptance of changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">Contact:</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-semibold">SavviWell</p>
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
