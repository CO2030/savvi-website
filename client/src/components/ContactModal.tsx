import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ContactFormData {
  name: string;
  email: string;
  reason: string;
  message: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const contactReasons = [
  { value: "general", label: "General Inquiry" },
  { value: "partnership", label: "Partnership Opportunity" },
  { value: "support", label: "Technical Support" },
  { value: "media", label: "Media/Press" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" }
];

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    reason: "",
    message: ""
  });

  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({ name: "", email: "", reason: "", message: "" });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.reason || !formData.message) {
      toast({
        title: "Please fill in all fields",
        description: "All fields are required to submit your message.",
        variant: "destructive",
      });
      return;
    }

    if (formData.message.length < 10) {
      toast({
        title: "Message too short",
        description: "Please provide a more detailed message (at least 10 characters).",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Mail className="h-6 w-6 text-green-600" />
            Contact Us
          </DialogTitle>
          <DialogDescription>
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Reason for Contact *</Label>
            <RadioGroup 
              value={formData.reason} 
              onValueChange={(value) => handleChange("reason", value)}
              className="grid grid-cols-2 gap-2"
            >
              {contactReasons.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label 
                    htmlFor={reason.value} 
                    className="text-sm font-normal cursor-pointer"
                  >
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
              placeholder="Tell us how we can help you..."
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              rows={4}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.message.length}/1000 characters (minimum 10)
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={contactMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {contactMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}