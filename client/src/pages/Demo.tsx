import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WaitlistModal } from '@/components/WaitlistModal';
import { Helmet } from 'react-helmet';

const DEMO_PASSWORD = "123SavviWellTeam";

export default function Demo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activePrompts, setActivePrompts] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState<{[key: number]: boolean}>({});
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = sessionStorage.getItem("demo_authenticated");
    if (saved === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("demo_authenticated", "true");
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleGenerateResponse = (promptId: number) => {
    setIsGenerating(prev => ({ ...prev, [promptId]: true }));
    
    setTimeout(() => {
      setActivePrompts(prev => [...prev, promptId]);
      setIsGenerating(prev => ({ ...prev, [promptId]: false }));
    }, 1500);
  };

  const handleJoinWaitlist = () => {
    setIsWaitlistOpen(true);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("demo_authenticated");
    setIsAuthenticated(false);
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Demo Access | SavviWell</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Team Demo Access</CardTitle>
              <p className="text-gray-600 mt-2">Enter the password to view the demo</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Access Demo
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>SavviWell App Demo | Team Access</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <header className="bg-primary py-3 px-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">SavviWell App Demo</h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              className="text-primary bg-white hover:bg-primary hover:text-white border-2 border-white transition-colors font-semibold"
            >
              Sign Out
            </Button>
          </div>
        </header>

        <div className="flex-1 w-full">
          <iframe
            src="https://mealplanningappdesigncopy-savviwell-figma-mobile-a--olofsson624.replit.app/?auth=savviwell"
            className="w-full h-full min-h-[calc(100vh-56px)] border-0"
            title="SavviWell App Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </>
  );
}
