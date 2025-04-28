
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Download, Printer, FileSpreadsheet, Search, Users, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

import { EmployeeActionsDropdown } from "@/components/employees/employee-actions";
import { EmptyState } from "@/components/employees/empty-state";
import { ExportButtons } from "@/components/employees/export-buttons";
import { CreateEmployeeButton } from "@/components/employees/create-employee-button";

export interface Employee {
  employee_id: string;
  fullName: string;
  jobTitle: string;
  project: string;
  location: string;
  sponsorship: string;
  status: string;
}

const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entity: "employees",
      operation: "read",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  return response.json();
};

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "all",
    project: "all",
    sponsorship: "all",
    status: "all",
    jobTitle: "all",
  });

  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  // Extract unique values for filters
  const uniqueValues = useMemo(() => {
    if (!employees.length) return { locations: [], projects: [], sponsorships: [], statuses: [], jobTitles: [] };
    
    return {
      locations: [...new Set(employees.map(emp => emp.location))].filter(Boolean).sort(),
      projects: [...new Set(employees.map(emp => emp.project))].filter(Boolean).sort(),
      sponsorships: [...new Set(employees.map(emp => emp.sponsorship))].filter(Boolean).sort(),
      statuses: [...new Set(employees.map(emp => emp.status))].filter(Boolean).sort(),
      jobTitles: [...new Set(employees.map(emp => emp.jobTitle))].filter(Boolean).sort(),
    };
  }, [employees]);

  // Apply filters and search
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];

    return employees.filter(employee => {
      // Apply search
      const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply filters
      const matchesLocation = filters.location === "all" || employee.location === filters.location;
      const matchesProject = filters.project === "all" || employee.project === filters.project;
      const matchesSponsorship = filters.sponsorship === "all" || employee.sponsorship === filters.sponsorship;
      const matchesStatus = filters.status === "all" || employee.status === filters.status;
      const matchesJobTitle = filters.jobTitle === "all" || employee.jobTitle === filters.jobTitle;
      
      return matchesSearch && matchesLocation && matchesProject && matchesSponsorship && matchesStatus && matchesJobTitle;
    });
  }, [employees, searchTerm, filters]);

  const resetFilters = () => {
    setFilters({
      location: "all",
      project: "all",
      sponsorship: "all",
      status: "all",
      jobTitle: "all",
    });
    setSearchTerm("");
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const isFiltersActive = Object.values(filters).some(filter => filter !== "all") || searchTerm !== "";

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch employees data. Please try again later.");
    }
  }, [error]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-ydm-secondary" />
              <h1 className="text-2xl md:text-3xl font-bold">Employees</h1>
            </div>
            <p className="text-muted-foreground mt-1">Manage your employee records</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <CreateEmployeeButton />
          </div>
        </header>
        
        <div className="bg-card rounded-lg border shadow-sm p-4 mb-8">
          {/* Search & Filters */}
          <div className="flex flex-col gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees by name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              <Select
                value={filters.location}
                onValueChange={(value) => handleFilterChange("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueValues.locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={filters.project}
                onValueChange={(value) => handleFilterChange("project", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {uniqueValues.projects.map(project => (
                    <SelectItem key={project} value={project}>{project}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={filters.sponsorship}
                onValueChange={(value) => handleFilterChange("sponsorship", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sponsorship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sponsorships</SelectItem>
                  {uniqueValues.sponsorships.map(sponsorship => (
                    <SelectItem key={sponsorship} value={sponsorship}>{sponsorship}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueValues.statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={filters.jobTitle}
                onValueChange={(value) => handleFilterChange("jobTitle", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Job Title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Job Titles</SelectItem>
                  {uniqueValues.jobTitles.map(jobTitle => (
                    <SelectItem key={jobTitle} value={jobTitle}>{jobTitle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isFiltersActive && (
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters} 
                  className="flex items-center gap-1 text-muted-foreground"
                >
                  <X className="h-4 w-4" /> 
                  Clear filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Export Buttons */}
          <ExportButtons employees={filteredEmployees} />
          
          {/* Employees Table */}
          {isLoading ? (
            <div className="py-16 flex justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-muted rounded mb-2"></div>
                <div className="h-3 w-32 bg-muted rounded"></div>
              </div>
            </div>
          ) : filteredEmployees.length > 0 ? (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID/Iqama</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Sponsorship</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.employee_id}>
                      <TableCell className="font-medium">{employee.employee_id}</TableCell>
                      <TableCell>{employee.fullName}</TableCell>
                      <TableCell>{employee.jobTitle}</TableCell>
                      <TableCell>{employee.project}</TableCell>
                      <TableCell>{employee.location}</TableCell>
                      <TableCell>{employee.sponsorship}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={employee.status?.toLowerCase() === "active" ? "default" : "destructive"}
                          className={employee.status?.toLowerCase() === "active" ? "bg-green-500" : ""}
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <EmployeeActionsDropdown employee={employee} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;
