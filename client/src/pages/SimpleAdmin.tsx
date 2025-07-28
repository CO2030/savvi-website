import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { WaitlistEntry, ContactSubmission } from "@shared/schema";
import { Logo } from "@/components/Logo";
import { apiRequest } from "@/lib/queryClient";
import { Download, Trash2 } from "lucide-react";

export default function SimpleAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication status with server
  const { data: authStatus } = useQuery({
    queryKey: ["/api/admin/status"],
    retry: false,
  });

  useEffect(() => {
    if (authStatus?.authenticated) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem('admin_auth');
    }
  }, [authStatus]);

  // Handle authentication with server-side validation
  const loginMutation = useMutation({
    mutationFn: (password: string) => apiRequest("POST", "/api/admin/login", { password }),
    onSuccess: () => {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      // Invalidate auth status to refresh data access
      queryClient.invalidateQueries({ queryKey: ["/api/admin/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({
        title: "Access granted",
        description: "Welcome to admin dashboard",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Access denied",
        description: "Incorrect password",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(password);
  };

  // Handle logout with server-side session clearing
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/logout", {}),
    onSuccess: () => {
      setIsAuthenticated(false);
      localStorage.removeItem('admin_auth');
      toast({
        title: "Logged out",
        description: "Logged out successfully",
      });
    },
    onError: () => {
      // Still clear local state even if server logout fails
      setIsAuthenticated(false);
      localStorage.removeItem('admin_auth');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
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

  // Mutation to add test data
  const addTestDataMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/test/add-sample-data", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({
        title: "Test data added",
        description: "Sample entries have been added to demonstrate grouping",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add test data",
        variant: "destructive",
      });
    },
  });

  // Mutation to delete waitlist entry
  const deleteWaitlistMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/waitlist/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist"] });
      toast({
        title: "Entry deleted",
        description: "Waitlist entry has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    },
  });

  // Mutation to delete contact submission
  const deleteContactMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/contact/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({
        title: "Submission deleted",
        description: "Contact submission has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    },
  });

  // Download functions
  const downloadCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(","),
      ...data.map((item) => 
        headers.map(header => {
          const value = item[header.toLowerCase().replace(/\s+/g, '')];
          return value ? `"${value.toString().replace(/"/g, '""')}"` : '""';
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadWaitlistCSV = () => {
    if (!waitlistEntries || waitlistEntries.length === 0) {
      toast({
        title: "No data to download",
        description: "There are no waitlist entries to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Name", "Email", "UserType", "HealthGoal", "DietaryConcern", "Source", "CreatedAt"];
    const formattedData = waitlistEntries.map(entry => ({
      name: entry.name,
      email: entry.email,
      usertype: entry.userType,
      healthgoal: entry.healthGoal,
      dietaryconcern: entry.dietaryConcern,
      source: entry.source || 'Direct',
      createdat: new Date(entry.createdAt).toLocaleDateString()
    }));

    downloadCSV(formattedData, `waitlist_entries_${new Date().toISOString().split('T')[0]}.csv`, headers);
    toast({
      title: "Download started",
      description: "Waitlist CSV file is being downloaded",
    });
  };

  const downloadContactsCSV = () => {
    if (!contactSubmissions || contactSubmissions.length === 0) {
      toast({
        title: "No data to download",
        description: "There are no contact submissions to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Name", "Email", "Reason", "Message", "CreatedAt"];
    const formattedData = contactSubmissions.map(submission => ({
      name: submission.name,
      email: submission.email,
      reason: submission.reason,
      message: submission.message,
      createdat: new Date(submission.createdAt).toLocaleDateString()
    }));

    downloadCSV(formattedData, `contact_submissions_${new Date().toISOString().split('T')[0]}.csv`, headers);
    toast({
      title: "Download started",
      description: "Contact submissions CSV file is being downloaded",
    });
  };

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
            <Button 
              type="submit" 
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
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

  // Group waitlist entries by user type and health goal
  const groupedWaitlist = waitlistEntries ? waitlistEntries.reduce((groups, entry) => {
    const key = `${entry.userType} - ${entry.healthGoal}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(entry);
    return groups;
  }, {} as Record<string, WaitlistEntry[]>) : {};

  // Group contact submissions by reason
  const groupedContacts = contactSubmissions ? contactSubmissions.reduce((groups, submission) => {
    const key = submission.reason || 'General Inquiry';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(submission);
    return groups;
  }, {} as Record<string, ContactSubmission[]>) : {};

  // Show dashboard when authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex space-x-2">
              <Button 
                onClick={downloadWaitlistCSV} 
                variant="outline"
                disabled={!waitlistEntries || waitlistEntries.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Waitlist CSV
              </Button>
              <Button 
                onClick={downloadContactsCSV} 
                variant="outline"
                disabled={!contactSubmissions || contactSubmissions.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Contacts CSV
              </Button>
              <Button 
                onClick={() => addTestDataMutation.mutate()} 
                variant="outline"
                disabled={addTestDataMutation.isPending}
              >
                {addTestDataMutation.isPending ? "Adding..." : "Add Test Data"}
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Waitlist Section - Grouped by User Type & Health Goal */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Waitlist Entries ({waitlistEntries?.length || 0})
            </h2>
            
            {waitlistLoading ? (
              <p>Loading waitlist entries...</p>
            ) : Object.keys(groupedWaitlist).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(groupedWaitlist).map(([group, entries]) => (
                  <div key={group} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3 text-blue-600">
                      {group} ({entries.length})
                    </h3>
                    <div className="space-y-3">
                      {entries.map((entry: WaitlistEntry) => (
                        <div key={entry.id} className="bg-gray-50 rounded p-3">
                          <div className="flex justify-between items-start">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm flex-1">
                              <div><strong>Name:</strong> {entry.name}</div>
                              <div><strong>Email:</strong> {entry.email}</div>
                              <div className="md:col-span-2"><strong>Dietary Concern:</strong> {entry.dietaryConcern}</div>
                              <div><strong>Source:</strong> {entry.source || 'Direct'}</div>
                              <div className="text-gray-500">
                                <strong>Date:</strong> {new Date(entry.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteWaitlistMutation.mutate(entry.id)}
                              disabled={deleteWaitlistMutation.isPending}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No waitlist entries yet</p>
            )}
          </div>

          {/* Contact Section - Grouped by Reason */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Contact Submissions ({contactSubmissions?.length || 0})
            </h2>
            
            {contactLoading ? (
              <p>Loading contact submissions...</p>
            ) : Object.keys(groupedContacts).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(groupedContacts).map(([reason, submissions]) => (
                  <div key={reason} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3 text-green-600 capitalize">
                      {reason} ({submissions.length})
                    </h3>
                    <div className="space-y-3">
                      {submissions.map((submission: ContactSubmission) => (
                        <div key={submission.id} className="bg-gray-50 rounded p-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 text-sm flex-1">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div><strong>Name:</strong> {submission.name}</div>
                                <div><strong>Email:</strong> {submission.email}</div>
                              </div>
                              <div><strong>Message:</strong> {submission.message}</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-500">
                                <div><strong>Source:</strong> {submission.source || 'Direct'}</div>
                                <div><strong>Date:</strong> {new Date(submission.createdAt).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteContactMutation.mutate(submission.id)}
                              disabled={deleteContactMutation.isPending}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No contact submissions yet</p>
            )}
          </div>
        </div>

        {/* Analytics & Summary Stats */}
        <div className="mt-8 space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{waitlistEntries?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Waitlist</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{contactSubmissions?.length || 0}</div>
              <div className="text-sm text-gray-600">Contact Submissions</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(groupedWaitlist).length}</div>
              <div className="text-sm text-gray-600">Waitlist Categories</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{Object.keys(groupedContacts).length}</div>
              <div className="text-sm text-gray-600">Contact Reasons</div>
            </div>
          </div>

          {/* Source Analytics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Source Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Waitlist Sources */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">Waitlist Entry Sources</h3>
                <div className="space-y-2">
                  {waitlistEntries && Object.entries(
                    waitlistEntries.reduce((sources, entry) => {
                      const source = entry.source || 'direct';
                      sources[source] = (sources[source] || 0) + 1;
                      return sources;
                    }, {} as Record<string, number>)
                  ).sort(([,a], [,b]) => b - a).map(([source, count]) => (
                    <div key={source} className="flex justify-between items-center bg-blue-50 p-2 rounded">
                      <span className="capitalize text-sm font-medium">{source.replace(/-/g, ' ')}</span>
                      <span className="text-blue-600 font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Sources */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-green-600">Contact Entry Sources</h3>
                <div className="space-y-2">
                  {contactSubmissions && Object.entries(
                    contactSubmissions.reduce((sources, submission) => {
                      const source = submission.source || 'direct';
                      sources[source] = (sources[source] || 0) + 1;
                      return sources;
                    }, {} as Record<string, number>)
                  ).sort(([,a], [,b]) => b - a).map(([source, count]) => (
                    <div key={source} className="flex justify-between items-center bg-green-50 p-2 rounded">
                      <span className="capitalize text-sm font-medium">{source.replace(/-/g, ' ')}</span>
                      <span className="text-green-600 font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Marketing Insights */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Marketing Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Top Waitlist Source:</strong> {waitlistEntries && waitlistEntries.length > 0 ? 
                    Object.entries(waitlistEntries.reduce((sources, entry) => {
                      const source = entry.source || 'direct';
                      sources[source] = (sources[source] || 0) + 1;
                      return sources;
                    }, {} as Record<string, number>)).sort(([,a], [,b]) => b - a)[0]?.[0]?.replace(/-/g, ' ') || 'None'
                    : 'None'
                  }
                </div>
                <div>
                  <strong>Social Media Entries:</strong> {waitlistEntries ? 
                    waitlistEntries.filter(e => e.source?.includes('facebook') || e.source?.includes('instagram') || e.source?.includes('twitter') || e.source?.includes('linkedin')).length
                    : 0
                  }
                </div>
                <div>
                  <strong>Lead Magnet Performance:</strong> {waitlistEntries ? 
                    waitlistEntries.filter(e => e.source?.includes('5-day-lead-magnet')).length
                    : 0
                  } entries
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}