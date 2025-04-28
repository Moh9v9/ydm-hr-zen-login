
import { Edit, Trash2 } from "lucide-react";
import { Employee } from "@/pages/Employees";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface EmployeeActionsDropdownProps {
  employee: Employee;
}

export function EmployeeActionsDropdown({ employee }: EmployeeActionsDropdownProps) {
  const handleEdit = () => {
    // Implementation will be added later
    console.log("Edit employee:", employee);
  };

  const handleDelete = () => {
    // Implementation will be added later
    console.log("Delete employee:", employee);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
