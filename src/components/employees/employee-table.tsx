
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmployeeActionsDropdown } from "@/components/employees/employee-actions";
import { EmptyState } from "@/components/employees/empty-state";
import type { Employee } from "@/hooks/use-employees";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
}

export function EmployeeTable({ employees, isLoading }: EmployeeTableProps) {
  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-muted rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded mb-2"></div>
          <div className="h-3 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>ID/Iqama</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Sponsorship</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.employee_id}>
              <TableCell>{employee.fullName}</TableCell>
              <TableCell className="font-medium">{employee.id_iqama_national}</TableCell>
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
  );
}
