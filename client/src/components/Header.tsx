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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      closeMobileMenu();
    }
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
            onClick={() => scrollToSection('features')}
            className="text-neutral-dark hover:text-primary transition-colors"
          >
            Member Perks
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="text-neutral-dark hover:text-primary transition-colors"
          >
            About
          </button>
          <a href="/contact" className="text-neutral-dark hover:text-primary transition-colors">Contact</a>
        </nav>
        <div className="hidden md:flex space-x-3">
          <Button 
            onClick={onWaitlistClick}
            className="bg-primary hover:bg-primary/90 transition-colors"
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
              onClick={() => scrollToSection('features')}
              className="text-neutral-dark hover:text-primary transition-colors py-2"
            >
              Member Perks
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-neutral-dark hover:text-primary transition-colors py-2"
            >
              About
            </button>
            <Button 
              onClick={() => {
                onWaitlistClick();
                closeMobileMenu();
              }}
              className="w-full bg-primary hover:bg-primary/90 transition-colors"
            >
              Join the Waitlist
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}