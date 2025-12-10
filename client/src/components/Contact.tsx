
import { useState, useEffect } from "react";
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
  source?: string;
}

// Analytics utilities
const getSourceFromURL = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('source') || urlParams.get('utm_source') || urlParams.get('ref');
  if (source) return source;
  
  const referrer = document.referrer;
  if (referrer) {
    if (referrer.includes('facebook.com')) return 'facebook';
    if (referrer.includes('instagram.com')) return 'instagram';
    if (referrer.includes('twitter.com') || referrer.includes('x.com')) return 'twitter';
    if (referrer.includes('linkedin.com')) return 'linkedin';
    if (referrer.includes('youtube.com')) return 'youtube';
    if (referrer.includes('tiktok.com')) return 'tiktok';
    if (referrer.includes('google.com')) return 'google-search';
    if (referrer.includes('bing.com')) return 'bing-search';
    return 'external-website';
  }
  
  return 'direct';
};

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
  const [source, setSource] = useState<string>('direct');

  const { toast } = useToast();

  // Capture source on component mount
  useEffect(() => {
    const detectedSource = getSourceFromURL();
    setSource(detectedSource);
  }, []);

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const dataWithSource = {
        ...data,
        source: `contact-${source}`
      };
      return apiRequest("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithSource),
      });
    },
    onSuccess: () => {
      // Track conversion in Google Analytics
      if (typeof window !== 'undefined' && (window as any).trackFormSubmission) {
        (window as any).trackFormSubmission('contact_form', source);
      }
      
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

        <div className="max-w-2xl mx-auto">
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
