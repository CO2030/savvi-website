import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface LogoProps {
  className?: string;
  color?: "primary" | "white";
}

export function Logo({ className, color = "primary" }: LogoProps) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation("/");
  };

  return (
    <span 
      onClick={handleClick}
      className={cn(
        "text-2xl font-bold font-logo cursor-pointer hover:opacity-80 transition-opacity",
        color === "primary" ? "text-primary" : "text-white",
        className
      )}
    >
      SavviWell
    </span>
  );
}
