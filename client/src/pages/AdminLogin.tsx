import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const loginMutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      apiRequest("POST", "/api/admin/login", credentials),
    onSuccess: () => {
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      setLocation("/admin/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, use a simple hardcoded check
    // In a real app, this would be handled properly on the server
    if (username === "admin" && password === "savviwell2025") {
      // Skip the server call for now and just navigate
      setLocation("/admin/dashboard");
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
    
    // In a real application, we would do:
    // loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="flex justify-center">
          <Logo className="h-12" />
        </div>
        
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
        
        <div className="text-center mt-4">
          <a 
            href="/" 
            className="text-sm text-primary hover:underline"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}