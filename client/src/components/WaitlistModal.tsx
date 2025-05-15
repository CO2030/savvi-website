import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import confetti from "canvas-confetti";

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
  const [step, setStep] = useState(1);
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
  
  const progressPercentage = step === 5 ? 100 : step * 25;
  
  const mutation = useMutation({
    mutationFn: (data: FormValues) => 
      apiRequest("POST", "/api/waitlist", data),
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
      toast({
        title: "Error submitting form",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
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

  const handleNextStep = () => {
    if (step === 1) {
      const nameValid = validateField('name');
      const emailValid = validateField('email');
      
      if (!nameValid || !emailValid) return;
    }
    
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    setStep(1);
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="w-full mb-4">
            <Progress value={progressPercentage} className="h-1" />
          </div>
          
          {!success ? (
            <form onSubmit={handleSubmit}>
              <DialogTitle className="text-center text-xl font-bold mb-2">Join the Waitlist</DialogTitle>
              <DialogDescription className="text-center mb-6">
                Be among the first to experience SavviWell
              </DialogDescription>
              
              {step === 1 && (
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
                    type="button" 
                    className="w-full"
                    onClick={handleNextStep}
                  >
                    Continue
                  </Button>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-3">
                    <Label>Are you signing up as:</Label>
                    <RadioGroup 
                      onValueChange={(value) => setFormValues({...formValues, userType: value})}
                      defaultValue={formValues.userType}
                      className="space-y-2"
                    >
                      {[
                        { value: "individual", label: "Individual" },
                        { value: "parent", label: "Parent" },
                        { value: "caregiver", label: "Caregiver" },
                        { value: "older-adult", label: "Older Adult" }
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="cursor-pointer flex-1">{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={handlePrevStep}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      className="w-full"
                      onClick={handleNextStep}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-3">
                    <Label>Main health goal?</Label>
                    <RadioGroup 
                      onValueChange={(value) => setFormValues({...formValues, healthGoal: value})}
                      defaultValue={formValues.healthGoal}
                      className="space-y-2"
                    >
                      {[
                        { value: "energy", label: "Energy" },
                        { value: "gut-health", label: "Gut Health" },
                        { value: "blood-sugar", label: "Blood Sugar" },
                        { value: "weight-loss", label: "Weight Loss" },
                        { value: "other", label: "Other" }
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value={option.value} id={`health-${option.value}`} />
                          <Label htmlFor={`health-${option.value}`} className="cursor-pointer flex-1">{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={handlePrevStep}
                    >
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      className="w-full"
                      onClick={handleNextStep}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-3">
                    <Label>Dietary concerns?</Label>
                    <RadioGroup 
                      onValueChange={(value) => setFormValues({...formValues, dietaryConcern: value})}
                      defaultValue={formValues.dietaryConcern}
                      className="space-y-2"
                    >
                      {[
                        { value: "gluten-free", label: "Gluten-Free" },
                        { value: "vegan", label: "Vegan" },
                        { value: "low-sugar", label: "Low Sugar" },
                        { value: "none", label: "None" }
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value={option.value} id={`diet-${option.value}`} />
                          <Label htmlFor={`diet-${option.value}`} className="cursor-pointer flex-1">{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={handlePrevStep}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Submitting..." : "Join Waitlist"}
                    </Button>
                  </div>
                </div>
              )}
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
              <Button 
                className="w-full"
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
