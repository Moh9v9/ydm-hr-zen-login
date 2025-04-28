
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { CreateEmployeeButton } from "@/components/employees/create-employee-button";
import { ExportButtons } from "@/components/employees/export-buttons";
import { EmployeeFilters } from "@/components/employees/employee-filters";
import { EmployeeTable } from "@/components/employees/employee-table";
import { useEmployees } from "@/hooks/use-employees";

const Employees = () => {
  console.log("Rendering Employees component");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "all",
    project: "all",
    sponsorship: "all",
    status: "all",
    jobTitle: "all",
  });

  const { data: employees = [], isLoading, error } = useEmployees();

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
      const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase());
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
      console.error("Employee fetch error:", error);
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
          <EmployeeFilters 
            filters={filters}
            uniqueValues={uniqueValues}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            isFiltersActive={isFiltersActive}
          />
          
          <ExportButtons employees={filteredEmployees} />
          
          <EmployeeTable 
            employees={filteredEmployees}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Employees;
