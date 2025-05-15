import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function Testimonials() {
  // These are placeholder testimonials
  const testimonials = [
    {
      initials: "JD",
      name: "Jennifer D.",
      role: "Working Parent",
      content: "The personalized meal plans have transformed our family dinners. We save time on planning and my kids are actually eating vegetables now!",
      rating: 5
    },
    {
      initials: "MT",
      name: "Michael T.",
      role: "Fitness Enthusiast",
      content: "I've tried many nutrition apps, but SavviWell really understands my fitness goals. The AI recommendations align perfectly with my macros and training schedule.",
      rating: 5
    },
    {
      initials: "SL",
      name: "Sarah L.",
      role: "Caregiver",
      content: "SavviWell has been a lifesaver for managing my mother's dietary needs. The special diet recommendations and shopping lists save me hours each week.",
      rating: 4.5
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-heading">What Our Beta Testers Say</h2>
        <p className="text-neutral-dark text-center max-w-2xl mx-auto mb-12">Here's what our early users are experiencing with SavviWell</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-50 border-none hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">{testimonial.initials}</span>
                  </div>
                  <div>
                    <h3 className="font-bold font-heading">{testimonial.name}</h3>
                    <p className="text-sm text-neutral-dark">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-neutral-dark mb-3">{testimonial.content}</p>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className="h-4 w-4 fill-current" 
                      fill={i < Math.floor(testimonial.rating) ? "currentColor" : "none"}
                      strokeWidth={i < Math.floor(testimonial.rating) ? 0 : 2}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
