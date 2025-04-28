import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployees } from "@/hooks/use-employees";

interface AttendanceFiltersProps {
  filters: {
    project: string;
    location: string;
    paymentType: string;
    sponsorship: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      project: string;
      location: string;
      paymentType: string;
      sponsorship: string;
    }>
  >;
}

export function AttendanceFilters({
  filters,
  setFilters,
}: AttendanceFiltersProps) {
  const { data: employees } = useEmployees();
  const [projects, setProjects] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<string[]>([]);
  const [sponsorships, setSponsorships] = useState<string[]>([]);
  
  // Extract unique filter options from employees data
  useEffect(() => {
    if (!employees) return;
    
    const projectSet = new Set<string>();
    const locationSet = new Set<string>();
    const paymentTypeSet = new Set<string>();
    const sponsorshipSet = new Set<string>();
    
    employees.forEach((employee) => {
      if (employee.project) projectSet.add(employee.project);
      if (employee.location) locationSet.add(employee.location);
      if (employee.paymentType) paymentTypeSet.add(employee.paymentType);
      if (employee.sponsorship) sponsorshipSet.add(employee.sponsorship);
    });
    
    setProjects(Array.from(projectSet).sort());
    setLocations(Array.from(locationSet).sort());
    setPaymentTypes(Array.from(paymentTypeSet).sort());
    setSponsorships(Array.from(sponsorshipSet).sort());
  }, [employees]);
  
  // Convert empty string filters to "all" for display but keep state as empty string
  const displayFilters = {
    project: filters.project || "all",
    location: filters.location || "all",
    paymentType: filters.paymentType || "all",
    sponsorship: filters.sponsorship || "all"
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4">
      <div className="flex flex-col gap-4">
        <div className="text-sm font-medium">Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Project</label>
            <Select
              value={displayFilters.project}
              onValueChange={(value) =>
                setFilters({ ...filters, project: value === "all" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Location</label>
            <Select
              value={displayFilters.location}
              onValueChange={(value) =>
                setFilters({ ...filters, location: value === "all" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Payment Type</label>
            <Select
              value={displayFilters.paymentType}
              onValueChange={(value) =>
                setFilters({ ...filters, paymentType: value === "all" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Payment Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Types</SelectItem>
                {paymentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Sponsorship</label>
            <Select
              value={displayFilters.sponsorship}
              onValueChange={(value) =>
                setFilters({ ...filters, sponsorship: value === "all" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Sponsorships" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sponsorships</SelectItem>
                {sponsorships.map((sponsorship) => (
                  <SelectItem key={sponsorship} value={sponsorship}>
                    {sponsorship}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
