import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import { Headphones, Play, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Podcast() {
  return (
    <>
      <Helmet>
        <title>Podcast | SavviWell</title>
        <meta name="description" content="Listen to the SavviWell podcast for tips on nutrition, wellness, and raising healthy families." />
      </Helmet>
      <Header onWaitlistClick={() => {}} />
      <main className="min-h-screen" style={{ backgroundColor: '#f5f0eb' }}>
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Headphones className="w-5 h-5" />
              <span className="font-medium">SavviWell Podcast</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" data-testid="text-podcast-title">
              Coming Soon
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              We're working on bringing you insightful conversations about nutrition, wellness, and raising healthy families. Stay tuned!
            </p>
          </div>
        </section>

        <section className="py-16 px-4" style={{ backgroundColor: '#f5f0eb' }}>
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
              What to Expect
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Expert Interviews</h3>
                  <p className="text-gray-600">Conversations with nutritionists, wellness experts, and parents sharing their journeys.</p>
                </CardContent>
              </Card>
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Bite-Sized Episodes</h3>
                  <p className="text-gray-600">Quick, actionable tips you can listen to during your busy day.</p>
                </CardContent>
              </Card>
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Weekly Episodes</h3>
                  <p className="text-gray-600">New episodes every week to keep you inspired and informed.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
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
              onClick={() => {
                const element = document.getElementById('waitlist');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/#waitlist';
                }
              }}
              data-testid="button-podcast-waitlist"
            >
              Join the Waitlist
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
