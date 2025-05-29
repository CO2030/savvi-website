import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { WaitlistEntry, ContactSubmission } from "@shared/schema";
import { Logo } from "@/components/Logo";

export default function SimpleAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  // Check if already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with password:', password);
    
    if (password === "savviwell2025") {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      toast({
        title: "Access granted",
        description: "Welcome to admin dashboard",
      });
    } else {
      toast({
        title: "Access denied",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    toast({
      title: "Logged out",
      description: "Logged out successfully",
    });
  };

  // Fetch data only when authenticated
  const { data: waitlistEntries, isLoading: waitlistLoading } = useQuery<WaitlistEntry[]>({
    queryKey: ["/api/waitlist"],
    enabled: isAuthenticated,
  });

  const { data: contactSubmissions, isLoading: contactLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact"],
    enabled: isAuthenticated,
  });

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <Logo className="mx-auto h-12 mb-4" />
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-gray-600">Enter password to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <a href="/" className="text-sm text-blue-600 hover:underline">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Show dashboard when authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Waitlist Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Waitlist Entries ({waitlistEntries?.length || 0})
            </h2>
            
            {waitlistLoading ? (
              <p>Loading waitlist entries...</p>
            ) : waitlistEntries && waitlistEntries.length > 0 ? (
              <div className="space-y-4">
                {waitlistEntries.map((entry: WaitlistEntry) => (
                  <div key={entry.id} className="border rounded p-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><strong>Name:</strong> {entry.name}</div>
                      <div><strong>Email:</strong> {entry.email}</div>
                      <div><strong>Type:</strong> {entry.userType}</div>
                      <div><strong>Goal:</strong> {entry.healthGoal}</div>
                      <div className="col-span-2"><strong>Concern:</strong> {entry.dietaryConcern}</div>
                      <div className="col-span-2 text-gray-500">
                        <strong>Date:</strong> {new Date(entry.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No waitlist entries yet</p>
            )}
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Contact Submissions ({contactSubmissions?.length || 0})
            </h2>
            
            {contactLoading ? (
              <p>Loading contact submissions...</p>
            ) : contactSubmissions && contactSubmissions.length > 0 ? (
              <div className="space-y-4">
                {contactSubmissions.map((submission: ContactSubmission) => (
                  <div key={submission.id} className="border rounded p-4">
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {submission.name}</div>
                      <div><strong>Email:</strong> {submission.email}</div>
                      <div><strong>Reason:</strong> {submission.reason}</div>
                      <div><strong>Message:</strong> {submission.message}</div>
                      <div className="text-gray-500">
                        <strong>Date:</strong> {new Date(submission.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No contact submissions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}