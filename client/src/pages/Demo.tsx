import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { WaitlistModal } from '@/components/WaitlistModal';

export default function Demo() {
  const [activePrompts, setActivePrompts] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState<{[key: number]: boolean}>({});
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const { toast } = useToast();

  const handleGenerateResponse = (promptId: number) => {
    setIsGenerating(prev => ({ ...prev, [promptId]: true }));
    
    // Simulate loading time
    setTimeout(() => {
      setActivePrompts(prev => [...prev, promptId]);
      setIsGenerating(prev => ({ ...prev, [promptId]: false }));
    }, 1500);
  };

  const handleJoinWaitlist = () => {
    setIsWaitlistOpen(true);
  };

  return (
    <div className="bg-[#f5fff7] min-h-screen pb-20">
      <header className="bg-white shadow">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-[#2e3c2f] text-center">Try SavviWell – Your Smart Meal Planning Assistant</h1>
          <p className="text-center text-slate-600 mt-2">Explore AI-powered responses to real-life family and health goals.</p>
        </div>
      </header>

      <div className="container mx-auto py-10 max-w-4xl px-4">
        <div className="space-y-6">
          {/* Prompt 1 */}
          <div className="bg-white p-6 rounded-xl shadow border border-[#d5e5d4]">
            <h3 className="font-semibold text-lg text-[#2e3c2f] mb-3">
              💬 I'm a mom with two kids. One is gluten-free. I want budget-friendly dinners.
            </h3>
            
            {!activePrompts.includes(1) ? (
              <Button 
                className="bg-[#3a925d] hover:bg-[#2e7d4c] transition-colors" 
                onClick={() => handleGenerateResponse(1)}
                disabled={isGenerating[1]}
              >
                {isGenerating[1] ? "Generating..." : "Generate Meal Plan"}
              </Button>
            ) : (
              <div className="bg-[#eaffea] p-4 rounded-lg border-l-4 border-[#6acb7d] mt-4 animate-fade-in">
                <p className="mb-3">✅ <span className="font-bold">Meal Plan Summary:</span> A kid-friendly, gluten-free week of dinners under $125.</p>
                
                <p className="mb-1">🍽️ <span className="font-bold">Sample Day:</span></p>
                <p>Dinner: Turkey taco bowls with rice, beans, and avocado.</p>
                <p className="italic">Swap for kids: Rice + shredded cheese + turkey</p>
                
                <p className="mt-3 mb-1">🛒 <span className="font-bold">Grocery List:</span></p>
                <p>Ground turkey, brown rice, corn, black beans, avocados, apples.</p>
                
                <div className="mt-4">
                  <Button 
                    className="bg-[#3a925d] hover:bg-[#2e7d4c] transition-colors"
                    onClick={handleJoinWaitlist}
                  >
                    Get My Personalized Plan
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Prompt 2 */}
          <div className="bg-white p-6 rounded-xl shadow border border-[#d5e5d4]">
            <h3 className="font-semibold text-lg text-[#2e3c2f] mb-3">
              💬 I want to boost my energy and avoid sugar. I'm vegetarian.
            </h3>
            
            {!activePrompts.includes(2) ? (
              <Button 
                className="bg-[#3a925d] hover:bg-[#2e7d4c] transition-colors" 
                onClick={() => handleGenerateResponse(2)}
                disabled={isGenerating[2]}
              >
                {isGenerating[2] ? "Generating..." : "Generate Meal Plan"}
              </Button>
            ) : (
              <div className="bg-[#eaffea] p-4 rounded-lg border-l-4 border-[#6acb7d] mt-4 animate-fade-in">
                <p className="mb-3">✅ <span className="font-bold">Meal Plan Summary:</span> Vegetarian, low-sugar meals to improve energy.</p>
                
                <p className="mb-1">🍽️ <span className="font-bold">Sample Day:</span></p>
                <p>Breakfast: Greek yogurt with chia & berries</p>
                <p>Lunch: Lentil-spinach bowl with tahini</p>
                <p>Dinner: Tofu stir-fry with brown rice</p>
                <p>Snack: Almonds + orange slices</p>
                
                <p className="mt-3 mb-1">🛒 <span className="font-bold">Grocery List:</span></p>
                <p>Tofu, spinach, lentils, tahini, berries, almonds.</p>
                
                <div className="mt-4">
                  <Button 
                    className="bg-[#3a925d] hover:bg-[#2e7d4c] transition-colors"
                    onClick={handleJoinWaitlist}
                  >
                    Get My Personalized Plan
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Prompt 3 */}
          <div className="bg-white p-6 rounded-xl shadow border border-[#d5e5d4]">
            <h3 className="font-semibold text-lg text-[#2e3c2f] mb-3">
              💬 I need high-protein meals for a diabetic adult and a picky 8-year-old.
            </h3>
            
            {!activePrompts.includes(3) ? (
              <Button 
                className="bg-[#3a925d] hover:bg-[#2e7d4c] transition-colors" 
                onClick={() => handleGenerateResponse(3)}
                disabled={isGenerating[3]}
              >
                {isGenerating[3] ? "Generating..." : "Generate Meal Plan"}
              </Button>
            ) : (
              <div className="bg-[#eaffea] p-4 rounded-lg border-l-4 border-[#6acb7d] mt-4 animate-fade-in">
                <p className="mb-3">✅ <span className="font-bold">Meal Plan Summary:</span> Balanced meals with high protein and low sugar, kid-friendly options included.</p>
                
                <p className="mb-1">🍽️ <span className="font-bold">Sample Day:</span></p>
                <p>Breakfast: Scrambled eggs + berries + whole wheat toast</p>
                <p>Lunch: Grilled chicken wraps with spinach + hummus</p>
                <p>Dinner: Baked salmon, quinoa, and steamed broccoli</p>
                <p>Snack: Cheese cubes + apple slices</p>
                
                <p className="mt-3 mb-1">🛒 <span className="font-bold">Grocery List:</span></p>
                <p>Eggs, berries, chicken, whole wheat wraps, salmon, quinoa, broccoli, apples, cheese.</p>
                
                <div className="mt-4">
                  <Button 
                    className="bg-[#3a925d] hover:bg-[#2e7d4c] transition-colors"
                    onClick={handleJoinWaitlist}
                  >
                    Get My Personalized Plan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <WaitlistModal 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
      />
    </div>
  );
}