import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { WaitlistEntry } from "@shared/schema";
import { 
  Download, 
  Search, 
  ArrowUpDown, 
  X,
  LogOut,
  Filter,
  FileJson,
  FileText
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

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof WaitlistEntry>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [passwordProtected, setPasswordProtected] = useState<boolean>(true);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch all waitlist entries
  const { data: waitlistEntries, isLoading, error } = useQuery<WaitlistEntry[]>({
    queryKey: ["/api/waitlist"],
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

  // Logout function
  const handleLogout = () => {
    window.location.href = "/";
    // In a real app, we would clear auth token/session
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

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Waitlist Dashboard</h1>
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
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        {sortedEntries.length} entries found
      </div>
    </div>
  );
}