
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmployeeActions } from "@/components/employees/employee-actions";
import { EmptyState } from "@/components/employees/empty-state";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { Employee } from "@/hooks/use-employees";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
}

export function EmployeeTable({ employees, isLoading }: EmployeeTableProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleSelectAll = () => {
    if (selectedEmployees.size === employees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(employees.map(emp => emp.employee_id)));
    }
  };

  const handleSelectEmployee = (employeeId: string) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entity: "employees",
          operation: "delete",
          data: Array.from(selectedEmployees).map(id => ({ employee_id: id }))
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete employees");
      }

      toast.success("Selected employees deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setSelectedEmployees(new Set());
    } catch (error) {
      console.error("Error deleting employees:", error);
      toast.error("Failed to delete employees");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

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
    <div className="space-y-4">
      {selectedEmployees.size > 0 && (
        <div className="flex items-center justify-between">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected ({selectedEmployees.size})
          </Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedEmployees.size === employees.length && employees.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all employees"
                />
              </TableHead>
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
                <TableCell>
                  <Checkbox
                    checked={selectedEmployees.has(employee.employee_id)}
                    onCheckedChange={() => handleSelectEmployee(employee.employee_id)}
                    aria-label={`Select ${employee.fullName}`}
                  />
                </TableCell>
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
                  <EmployeeActions employee={employee} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the selected employees? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleBulkDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
