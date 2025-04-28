
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
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
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

export function AttendanceFilters({
  filters,
  setFilters,
  selectedDate,
  setSelectedDate,
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
  
  const handleSetToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4">
      <div className="flex flex-col gap-4">
        <div className="text-sm font-medium">Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Project</label>
            <Select
              value={filters.project}
              onValueChange={(value) =>
                setFilters({ ...filters, project: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Projects</SelectItem>
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
              value={filters.location}
              onValueChange={(value) =>
                setFilters({ ...filters, location: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
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
              value={filters.paymentType}
              onValueChange={(value) =>
                setFilters({ ...filters, paymentType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Payment Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Payment Types</SelectItem>
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
              value={filters.sponsorship}
              onValueChange={(value) =>
                setFilters({ ...filters, sponsorship: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Sponsorships" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sponsorships</SelectItem>
                {sponsorships.map((sponsorship) => (
                  <SelectItem key={sponsorship} value={sponsorship}>
                    {sponsorship}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Date</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleSetToday}
                title="Set to today"
              >
                <span className="sr-only">Today</span>
                <span className="text-xs">Today</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
