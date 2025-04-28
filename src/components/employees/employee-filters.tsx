
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterValues {
  location: string;
  project: string;
  sponsorship: string;
  status: string;
  jobTitle: string;
}

interface UniqueValues {
  locations: string[];
  projects: string[];
  sponsorships: string[];
  statuses: string[];
  jobTitles: string[];
}

interface EmployeeFiltersProps {
  filters: FilterValues;
  uniqueValues: UniqueValues;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filterName: string, value: string) => void;
  onResetFilters: () => void;
  isFiltersActive: boolean;
}

export function EmployeeFilters({
  filters,
  uniqueValues,
  searchTerm,
  onSearchChange,
  onFilterChange,
  onResetFilters,
  isFiltersActive,
}: EmployeeFiltersProps) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search employees by name..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        <Select
          value={filters.location}
          onValueChange={(value) => onFilterChange("location", value)}
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
          onValueChange={(value) => onFilterChange("project", value)}
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
          onValueChange={(value) => onFilterChange("sponsorship", value)}
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
          onValueChange={(value) => onFilterChange("status", value)}
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
          onValueChange={(value) => onFilterChange("jobTitle", value)}
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
            onClick={onResetFilters} 
            className="flex items-center gap-1 text-muted-foreground"
          >
            <X className="h-4 w-4" /> 
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
