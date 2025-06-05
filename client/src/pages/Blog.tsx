
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Helmet } from "react-helmet";

export default function Blog() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const blogPosts = [
    {
      title: "How AI Assistants Are Revolutionizing Nutrition Planning",
      excerpt: "Discover how SavviWell's AI assistant makes personalized nutrition accessible to everyone.",
      date: "December 2024",
      readTime: "5 min read"
    },
    {
      title: "The Future of AI-Powered Meal Planning",
      excerpt: "Learn how artificial intelligence is transforming the way families approach healthy eating.",
      date: "December 2024", 
      readTime: "7 min read"
    },
    {
      title: "Why Savvi Well's AI Assistant Understands Your Family's Needs",
      excerpt: "Explore the technology behind personalized nutrition recommendations.",
      date: "November 2024",
      readTime: "6 min read"
    }
  ];

  return (
    <>
      <Helmet>
        <title>AI Nutrition Blog - SavviWell AI Assistant</title>
        <meta name="description" content="Learn about AI-powered nutrition, meal planning tips, and how SavviWell's AI assistant can transform your family's wellness journey." />
        <meta name="keywords" content="AI assistant, AI nutrition, Savvi Well blog, meal planning AI, nutrition AI, wellness AI, AI health assistant" />
      </Helmet>
      
      <Header onWaitlistClick={openModal} />
      <main className="font-sans pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 font-heading">
            AI Nutrition Insights
          </h1>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            Discover how SavviWell's AI assistant is revolutionizing personalized nutrition and meal planning
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5"></div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{post.date} • {post.readTime}</div>
                  <h2 className="text-xl font-bold mb-3 font-heading">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <button className="text-primary font-semibold hover:underline">
                    Coming Soon
                  </button>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4 font-heading">Stay Updated</h2>
              <p className="text-gray-600 mb-6">
                Join our waitlist to get notified when we publish new AI nutrition insights and launch SavviWell!
              </p>
              <button 
                onClick={openModal}
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WaitlistModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
