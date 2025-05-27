import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  color?: "primary" | "white";
}

export function Logo({ className, color = "primary" }: LogoProps) {
  return (
    <span 
      className={cn(
        "text-2xl font-bold font-heading",
        color === "primary" ? "text-primary" : "text-white",
        className
      )}
    >
      SavviWell
    </span>
  );
}
