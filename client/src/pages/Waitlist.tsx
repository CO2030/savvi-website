import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Check } from 'lucide-react';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

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

  return (
    <>
      <Helmet>
        <title>Join the Waitlist | SavviWell</title>
        <meta name="description" content="Join the SavviWell waitlist for early access to AI-powered meal planning and nutrition support for your family." />
        <meta property="og:title" content="Join the Waitlist | SavviWell" />
        <meta property="og:description" content="Be the first to experience smarter meal planning. Sign up for early access to SavviWell." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <Logo className="mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 font-heading mb-3">Join the Waitlist</h1>
            <p className="text-gray-600 text-lg">Be the first to experience smarter meal planning for your family.</p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base bg-white"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base bg-primary hover:bg-primary/90 font-semibold"
              >
                {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
              </Button>
            </form>
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-lg border border-green-100">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">You're on the list!</h2>
              <p className="text-gray-600">We'll let you know as soon as SavviWell is ready for you.</p>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-6">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>
    </>
  );
}