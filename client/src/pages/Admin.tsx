import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { WaitlistEntry, ContactSubmission } from "@shared/schema";
import { 
  Download, 
  Search, 
  ArrowUpDown, 
  X,
  LogOut,
  Filter,
  FileJson,
  FileText,
  Lock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Logo } from "@/components/Logo";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"waitlist" | "contact">("waitlist");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof WaitlistEntry>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setPasswordDialogOpen(false);
    }
  }, []);

  // Fetch all waitlist entries (only when authenticated)
  const { data: waitlistEntries, isLoading, error } = useQuery<WaitlistEntry[]>({
    queryKey: ["/api/waitlist"],
    enabled: isAuthenticated,
  });

  // Fetch all contact submissions (only when authenticated)
  const { data: contactSubmissions, isLoading: contactLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact"],
    enabled: isAuthenticated,
  });

  // Handle sorting
  const handleSort = (column: keyof WaitlistEntry) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Handle CSV export
  const handleExport = () => {
    if (!waitlistEntries || waitlistEntries.length === 0) {
      toast({
        title: "Nothing to export",
        description: "There are no waitlist entries to export.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = ["ID", "Name", "Email", "User Type", "Health Goal", "Dietary Concern", "Created At"];
    const rows = waitlistEntries.map((entry: WaitlistEntry) => [
      entry.id,
      entry.name,
      entry.email,
      entry.userType,
      entry.healthGoal,
      entry.dietaryConcern,
      new Date(entry.createdAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) => row.join(","))
    ].join("\\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `waitlist_entries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter entries by search term
  const filteredEntries = waitlistEntries
    ? waitlistEntries.filter(
        (entry: WaitlistEntry) =>
          entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.healthGoal.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.dietaryConcern.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Sort filtered entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Handle password authentication
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "savviwell2025") {
      setIsAuthenticated(true);
      setPasswordDialogOpen(false);
      sessionStorage.setItem('admin_authenticated', 'true');
      toast({
        title: "Access granted",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Access denied",
        description: "Incorrect password",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  // Logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setLocation("/");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="text-center py-12">Loading waitlist entries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="text-center py-12 text-red-500">
          Error loading waitlist entries. Please try again.
        </div>
      </div>
    );
  }

  // Show password dialog if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
          <div className="flex justify-center">
            <Logo className="h-12" />
          </div>
          
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold">Admin Access Required</h1>
            <p className="text-gray-600 mt-2">Enter the admin password to continue</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>
            
            <Button type="submit" className="w-full">
              Access Dashboard
            </Button>
          </form>
          
          <div className="text-center">
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

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 border-b">
        <button
          onClick={() => setActiveTab("waitlist")}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
            activeTab === "waitlist"
              ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Waitlist ({waitlistEntries?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
            activeTab === "contact"
              ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Contact Submissions ({contactSubmissions?.length || 0})
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search waitlist entries..."
          className="pl-10 pr-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <X
            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer"
            onClick={() => setSearchTerm("")}
          />
        )}
      </div>

      <div className="rounded-md border">
        {activeTab === "waitlist" ? (
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("id")}
              >
                ID
                {sortBy === "id" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name
                {sortBy === "name" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email
                {sortBy === "email" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("userType")}
              >
                User Type
                {sortBy === "userType" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("healthGoal")}
              >
                Health Goal
                {sortBy === "healthGoal" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("dietaryConcern")}
              >
                Dietary Concern
                {sortBy === "dietaryConcern" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                Created At
                {sortBy === "createdAt" && (
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  {searchTerm ? "No matching entries found" : "No waitlist entries found"}
                </TableCell>
              </TableRow>
            ) : (
              sortedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.id}</TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell>{entry.userType}</TableCell>
                  <TableCell>{entry.healthGoal}</TableCell>
                  <TableCell>{entry.dietaryConcern}</TableCell>
                  <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactSubmissions && contactSubmissions.length > 0 ? (
              contactSubmissions.map((submission: ContactSubmission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.id}</TableCell>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell className="capitalize">{submission.reason}</TableCell>
                  <TableCell className="max-w-xs truncate" title={submission.message ?? undefined}>
                    {submission.message}
                  </TableCell>
                  <TableCell>{new Date(submission.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {contactLoading ? "Loading..." : "No contact submissions yet"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        )}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        {activeTab === "waitlist" 
          ? `${sortedEntries.length} entries found`
          : `${contactSubmissions?.length || 0} submissions found`
        }
      </div>
    </div>
  );
}