import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import confetti from "canvas-confetti";
import { ShareSuccess } from "./ShareSuccess";

interface FormValues {
  name: string;
  email: string;
  userType: string;
  healthGoal: string;
  dietaryConcern: string;
}

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [success, setSuccess] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    userType: "individual",
    healthGoal: "energy", 
    dietaryConcern: "none"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const { getTrackingData } = await import('@/lib/tracking');
      const tracking = getTrackingData();
      return apiRequest("POST", "/api/waitlist", { ...data, ...tracking });
    },
    onSuccess: () => {
      setSuccess(true);

      // Fire confetti animation
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Fire confetti from both sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    },
    onError: (error: any) => {
      // Check if it's the email already registered error
      if (error.message && (error.message.includes("already registered") || error.alreadyRegistered)) {
        // Handle the duplicate email gracefully by showing success anyway
        setSuccess(true);

        toast({
          title: "Welcome back!",
          description: "You're already on our waitlist. We'll be in touch soon!",
          variant: "default"
        });
      } else {
        toast({
          title: "Error submitting form",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const validateField = (field: keyof FormValues): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    if (field === 'name' && (!formValues.name || formValues.name.length < 2)) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    } else if (field === 'name') {
      delete newErrors.name;
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formValues.email || !emailRegex.test(formValues.email)) {
        newErrors.email = "Please enter a valid email address";
        isValid = false;
      } else {
        delete newErrors.email;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameValid = validateField('name');
    const emailValid = validateField('email');
    if (!nameValid || !emailValid) return;
    mutation.mutate(formValues);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setSuccess(false);
    setFormValues({
      name: "",
      email: "",
      userType: "individual",
      healthGoal: "energy",
      dietaryConcern: "none"
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <div className="relative">

          {!success ? (
            <form onSubmit={handleSubmit}>
              <DialogTitle className="text-center text-xl font-bold mb-2">Join the Waitlist</DialogTitle>
              <DialogDescription className="text-center mb-6">
                Be among the first to experience SavviWell
              </DialogDescription>

              <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formValues.name}
                      onChange={handleInputChange}
                      onBlur={() => validateField('name')}
                      placeholder="Your name" 
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleInputChange}
                      onBlur={() => validateField('email')}
                      placeholder="your@email.com" 
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <Button 
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Submitting..." : "Join Waitlist"}
                  </Button>
                </div>
            </form>
          ) : (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold mb-2">You're on the list!</DialogTitle>
              <DialogDescription className="mb-6">
                Thanks for joining our waitlist. We'll notify you as soon as we're ready to welcome our first beta users.
              </DialogDescription>

              {/* Share Success Component */}
              <div className="mb-6">
                <ShareSuccess />
              </div>

              <Button 
                className="w-full hover:bg-orange-500 transition-colors"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}