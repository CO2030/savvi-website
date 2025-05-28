
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ContactFormData {
  name: string;
  email: string;
  reason: string;
  message: string;
}

const contactReasons = [
  { value: "general", label: "General Inquiry" },
  { value: "partnership", label: "Partnership Opportunity" },
  { value: "support", label: "Technical Support" },
  { value: "media", label: "Media/Press" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" }
];

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    reason: "",
    message: ""
  });

  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        reason: "",
        message: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.reason || !formData.message) {
      toast({
        title: "Please fill in all fields",
        description: "All fields are required to send your message.",
        variant: "destructive"
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about SavviWell? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-600">savviwell@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <MessageSquare className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Response Time</h4>
                    <p className="text-gray-600">We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Ready to Start Your Health Journey?</h4>
              <p className="text-gray-600 mb-4">
                Join thousands of others who are already transforming their health with personalized AI-powered nutrition.
              </p>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Join the Waitlist
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Reason for contacting *</Label>
                  <RadioGroup 
                    value={formData.reason}
                    onValueChange={(value) => handleInputChange("reason", value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                  >
                    {contactReasons.map((reason) => (
                      <div key={reason.value} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value={reason.value} id={`reason-${reason.value}`} />
                        <Label htmlFor={`reason-${reason.value}`} className="cursor-pointer flex-1 text-sm">
                          {reason.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
