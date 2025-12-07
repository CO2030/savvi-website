import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface HeaderProps {
  onWaitlistClick: () => void;
}

export function Header({ onWaitlistClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToAppSection = (id: string) => {
    // Navigate to /app page and scroll to section
    if (window.location.pathname !== "/app") {
      setLocation("/app");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // We're on app page, just scroll
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    closeMobileMenu();
  };

  return (
    <header className={cn(
      "fixed w-full bg-white bg-opacity-95 shadow-sm z-50 transition-all duration-300",
      isScrolled ? "py-2 shadow-md" : "py-3"
    )}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo />
        <nav className="hidden md:flex space-x-6">
          <button 
            onClick={() => setLocation('/')}
            className="text-neutral-dark hover:text-primary transition-colors"
          >
            Podcast
          </button>
          <button 
            onClick={() => setLocation('/app')}
            className="text-neutral-dark hover:text-primary transition-colors"
          >
            SavviWell App
          </button>
          <button 
            onClick={() => scrollToAppSection('features')}
            className="text-neutral-dark hover:text-primary transition-colors"
          >
            Member Perks
          </button>
          <button 
            onClick={() => setLocation('/story')}
            className="text-neutral-dark hover:text-primary transition-colors"
          >
            Our Story
          </button>
          <button 
            onClick={() => setLocation('/faq')}
            className="text-neutral-dark hover:text-primary transition-colors"
          >
            FAQ
          </button>

        </nav>
        <div className="hidden md:flex space-x-3">
          <Button 
            onClick={onWaitlistClick}
            size="lg"
            className="bg-primary hover:bg-primary/70 text-white font-bold shadow-lg transition-all transform hover:scale-105 px-4 lg:px-6 xl:px-8 py-2 lg:py-3 xl:py-4 text-sm lg:text-base xl:text-lg"
          >
            Join the Waitlist
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleMobileMenu}
          className="md:hidden"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white w-full py-4 animate-fade-in">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <button 
              onClick={() => {
                setLocation('/');
                closeMobileMenu();
              }}
              className="text-neutral-dark hover:text-primary transition-colors py-2"
            >
              Podcast
            </button>
            <button 
              onClick={() => {
                setLocation('/app');
                closeMobileMenu();
              }}
              className="text-neutral-dark hover:text-primary transition-colors py-2"
            >
              SavviWell App
            </button>
            <button 
              onClick={() => scrollToAppSection('features')}
              className="text-neutral-dark hover:text-primary transition-colors py-2"
            >
              Member Perks
            </button>
            <button 
              onClick={() => {
                setLocation('/story');
                closeMobileMenu();
              }}
              className="text-neutral-dark hover:text-primary transition-colors py-2"
            >
              Our Story
            </button>
            <button 
              onClick={() => {
                setLocation('/faq');
                closeMobileMenu();
              }}
              className="text-neutral-dark hover:text-primary transition-colors py-2"
            >
              FAQ
            </button>

            <Button 
              onClick={() => {
                onWaitlistClick();
                closeMobileMenu();
              }}
              size="lg"
              className="w-full bg-primary hover:bg-primary/70 text-white font-bold shadow-lg transition-all transform hover:scale-105 px-8 py-4 text-lg md:text-xl"
            >
              Join the Waitlist
            </Button>
          </div>
        </div>
      )}

    </header>
  );
}