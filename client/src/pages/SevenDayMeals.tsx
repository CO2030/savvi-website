import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Download, Clock, Users, Utensils, Heart } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import confetti from 'canvas-confetti';

// Lead magnet specific schema - simplified with just name and email
const leadMagnetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  userType: z.literal("individual"), // Default for lead magnet
  healthGoal: z.literal("energy"), // Default for 5-day meals
  dietaryConcern: z.literal("none"), // Default
  source: z.literal("5-day-lead-magnet")
});

type LeadMagnetFormData = z.infer<typeof leadMagnetSchema>;

export default function SevenDayMeals() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LeadMagnetFormData>({
    defaultValues: {
      name: "",
      email: "",
      userType: "individual",
      healthGoal: "energy",
      dietaryConcern: "none",
      source: "5-day-lead-magnet"
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: LeadMagnetFormData) => {
      await apiRequest("POST", "/api/waitlist", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "Success!",
        description: "Your 5-Day Healthy Meals guide is on its way!",
        duration: 5000
      });
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist"] });
    },
    onError: (error: any) => {
      if (error.message?.includes("already registered")) {
        toast({
          title: "Already Registered",
          description: "This email is already on our waitlist. Check your inbox for the meal guide!",
          variant: "default"
        });
        setIsSubmitted(true);
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again or contact support if the issue persists.",
          variant: "destructive"
        });
      }
    }
  });

  const onSubmit = (data: LeadMagnetFormData) => {
    // Manual validation since zodResolver isn't available
    const validation = leadMagnetSchema.safeParse(data);
    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.issues[0].message,
        variant: "destructive"
      });
      return;
    }
    submitMutation.mutate(validation.data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto text-center shadow-2xl border-0">
          <CardContent className="p-8 md:p-12">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                You're All Set!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Your <strong>5-Day Healthy Meals Guide</strong> is being prepared and will be delivered to your inbox within the next few minutes.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-green-800 mb-3">What's Next?</h3>
              <ul className="text-green-700 space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Check your email (including spam folder)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Download your meal planning guide
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Start your healthy eating journey
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                Explore SavviWell
              </Button>
              <p className="text-sm text-gray-500">
                You've also been added to our early access waitlist for the SavviWell AI assistant!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Get Your FREE<br />
            <span className="text-green-600">5-Day Healthy Meals</span><br />
            Planning Guide
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your family's eating habits with our expertly crafted meal plans, shopping lists, and prep guides - all designed to make healthy eating effortless.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Benefits Section */}
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <Clock className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Save 3+ Hours Weekly</h3>
                  <p className="text-gray-600 text-sm">No more wondering "what's for dinner?" - everything is planned for you.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <Utensils className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Simple, Delicious Recipes</h3>
                  <p className="text-gray-600 text-sm">Family-friendly meals that even picky eaters will love.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <Users className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Whole Family Approved</h3>
                  <p className="text-gray-600 text-sm">Nutritious meals designed for all ages and preferences.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <Heart className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Boost Energy & Health</h3>
                  <p className="text-gray-600 text-sm">Feel more energized with balanced, nutrient-rich meals.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">What You'll Get:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span><strong>5 Complete Meal Plans</strong> - Breakfast, lunch, and dinner for 5 days</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span><strong>Shopping Lists</strong> - Organized by grocery store sections</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span><strong>Prep Guide</strong> - Make-ahead tips to save even more time</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span><strong>Nutrition Tips</strong> - Simple ways to boost your family's health</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:order-first">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Get Your Free Guide Now
                </CardTitle>
                <p className="text-gray-600">Join 10,000+ families eating healthier</p>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Your Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your first name" 
                              className="h-12 text-lg"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="your.email@example.com" 
                              className="h-12 text-lg"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={submitMutation.isPending}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                          Preparing Your Guide...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Get My Free 7-Day Guide
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      We respect your privacy. Unsubscribe at any time. 
                      You'll also get early access to our AI nutrition assistant.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <p className="text-gray-600 mb-6">Trusted by families worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              No Spam, Ever
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              100% Free
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Instant Download
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}