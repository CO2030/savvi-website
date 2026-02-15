import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { Check, Sparkles, Clock, Shield, Zap, ChevronDown, ChevronUp, Users, Star } from 'lucide-react';
import { Footer } from '@/components/Footer';
import appMockup from '@assets/Green_&_Pink_Download_Free_Guide_Instagram_Post_(3)_1771167927492.png';

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target <= 0) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}</span>;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </button>
      {open && <p className="pb-5 text-gray-600 leading-relaxed">{answer}</p>}
    </div>
  );
}

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const { data: countData } = useQuery<{ count: number }>({
    queryKey: ['/api/waitlist/count'],
  });

  const isCountLoading = !countData;
  const displayCount = (countData?.count || 0) + 200;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/waitlist', {
        email,
        firstName: '',
        source: 'waitlist-page'
      });
      setIsSubmitted(true);
    } catch (error: any) {
      const message = error?.message || 'Something went wrong. Please try again.';
      if (message.includes('already')) {
        toast({
          title: "You're already on the list!",
          description: "We'll be in touch soon.",
        });
        setIsSubmitted(true);
      } else {
        toast({
          title: 'Oops!',
          description: message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: 'What is SavviWell?',
      answer: 'SavviWell is an AI-powered nutrition assistant that helps busy families plan healthy meals, generate personalized shopping lists, and discover recipes tailored to their dietary needs and preferences — all through a simple, conversational interface.'
    },
    {
      question: 'Is it really free to join the waitlist?',
      answer: 'Yes, joining the waitlist is completely free with no obligation. Early waitlist members will also receive exclusive benefits and pricing when we launch.'
    },
    {
      question: 'When will SavviWell launch?',
      answer: 'We\'re currently in private beta with a small group of families. Waitlist members will be the first to get access as we expand. We\'re aiming for broader availability in the coming months.'
    },
    {
      question: 'What makes SavviWell different from other meal planning apps?',
      answer: 'Unlike traditional apps that give you rigid meal plans, SavviWell uses AI to understand your family\'s unique preferences, dietary restrictions, and schedule. It adapts in real-time, suggests substitutions, and learns what your family loves over time.'
    },
    {
      question: 'Will my data be safe?',
      answer: 'Absolutely. We take data privacy seriously. Your personal information is encrypted and never shared with third parties. We only use your data to personalize your experience.'
    },
    {
      question: 'Can I use it if I have dietary restrictions?',
      answer: 'Yes! SavviWell is designed to accommodate all dietary needs including allergies, intolerances, vegetarian, vegan, gluten-free, keto, and more. Just tell the AI your requirements and it adapts everything accordingly.'
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Join the SavviWell Waitlist — AI Meal Planning for Families</title>
        <meta name="description" content="Get early access to SavviWell — the AI-powered meal planning assistant that helps busy families eat healthier with personalized recipes, smart shopping lists, and voice-guided nutrition support." />
        <meta property="og:title" content="Join the SavviWell Waitlist — AI Meal Planning for Families" />
        <meta property="og:description" content="Be among the first to experience smarter meal planning. Join 200+ families already on the waitlist." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://savviwell.com/waitlist" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* HERO — above the fold */}
      <section className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-12 md:pt-16 md:pb-20">
          <div className="flex justify-center mb-8">
            <Logo className="text-3xl md:text-4xl" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Left: copy + form */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Early Access — Limited Spots
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-heading leading-tight mb-4">
                Healthy meals for your family,{' '}
                <span className="text-primary">planned by AI</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                Stop stressing over what's for dinner. SavviWell's AI assistant creates
                personalized meal plans, recipes, and shopping lists — tailored to your
                family's tastes and dietary needs.
              </p>

              {!isSubmitted ? (
                <div>
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 text-base flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 px-8 text-base bg-primary hover:bg-primary/90 font-semibold whitespace-nowrap"
                    >
                      {isSubmitting ? 'Joining...' : 'Get Early Access'}
                    </Button>
                  </form>
                  <p className="text-xs text-gray-400 mt-3">Free to join. No spam, ever. Unsubscribe anytime.</p>
                </div>
              ) : (
                <div className="bg-green-50 rounded-xl p-8 border border-green-100 max-w-md mx-auto md:mx-0">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                    <Check className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">You're on the list!</h2>
                  <p className="text-gray-600">We'll let you know as soon as SavviWell is ready for you.</p>
                </div>
              )}

              {/* Social proof bar */}
              <div className="flex items-center gap-4 mt-8 justify-center md:justify-start">
                <div className="flex -space-x-2">
                  {['bg-rose-400', 'bg-sky-400', 'bg-amber-400', 'bg-violet-400'].map((color, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{['S', 'M', 'A', 'R'][i]}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  {isCountLoading ? (
                    <span className="font-semibold text-gray-900">200+</span>
                  ) : (
                    <span className="font-semibold text-gray-900">
                      <AnimatedCounter target={displayCount} />+
                    </span>
                  )}{' '}
                  families already waiting
                </div>
              </div>
            </div>

            {/* Right: app mockup */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl scale-90" />
                <img
                  src={appMockup}
                  alt="SavviWell AI meal planning app preview showing personalized meal suggestions"
                  className="relative w-72 md:w-80"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-gray-50 py-8 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-gray-400 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" /> Privacy-First
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" /> AI-Powered
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Family-Friendly
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" /> Dietitian-Informed
          </div>
        </div>
      </section>

      {/* PROBLEM → SOLUTION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 font-heading mb-4">
            Meal planning shouldn't feel like a chore
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Between picky eaters, busy schedules, and endless dietary needs, planning healthy meals is overwhelming. SavviWell changes that.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'Personalized AI Plans',
                description: 'Tell the AI about your family and it creates weekly meal plans tailored to your preferences, allergies, and budget.',
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Save Hours Every Week',
                description: 'No more scrolling recipes or wondering what to cook. Get instant suggestions and auto-generated shopping lists.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Built for Real Families',
                description: 'Handles picky eaters, multiple dietary needs, and last-minute changes. Because real life is messy.',
              },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 font-heading mb-12">
            What early testers are saying
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "I used to spend 45 minutes every Sunday planning meals. Now it takes me 5 minutes with SavviWell.",
                name: 'Sarah K.',
                role: 'Mom of 3',
              },
              {
                quote: "Finally an app that understands my son's food allergies AND my husband's keto diet at the same time.",
                name: 'Maria L.',
                role: 'Working parent',
              },
              {
                quote: "The shopping list feature alone is worth it. Everything organized by aisle — game changer.",
                name: 'David R.',
                role: 'Dad of 2',
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 font-heading mb-12">
            How SavviWell works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Tell us about your family', description: 'Share dietary preferences, allergies, and how many mouths to feed.' },
              { step: '2', title: 'Get your personalized plan', description: 'Our AI creates a weekly meal plan with recipes and a smart shopping list.' },
              { step: '3', title: 'Cook with confidence', description: 'Follow simple, step-by-step recipes. Swap meals anytime with one tap.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 font-heading mb-12">
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-4">
            Ready to simplify mealtime?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join <span className="font-semibold text-white">{displayCount}+ families</span> already on the waitlist. Early members get exclusive benefits when we launch.
          </p>

          {!isSubmitted ? (
            <div>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base flex-1 bg-white"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 text-base bg-white text-primary hover:bg-white/90 font-semibold whitespace-nowrap"
                >
                  {isSubmitting ? 'Joining...' : 'Join Now'}
                </Button>
              </form>
              <p className="text-white/60 text-xs mt-3">Free to join. No credit card required.</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur rounded-xl p-8 max-w-md mx-auto">
              <Check className="w-10 h-10 text-white mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">You're on the list!</h3>
              <p className="text-white/80">We'll notify you when SavviWell is ready.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
