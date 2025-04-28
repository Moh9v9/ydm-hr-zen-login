
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmployeeInfo } from "./employee-info";
import { AttendanceStatus } from "./attendance-status";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { type AttendanceRecord } from "@/types/attendance";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";

interface DesktopAttendanceRowProps {
  record: AttendanceRecord;
  onStatusChange: (employeeId: string, currentStatus: string, isActive: boolean) => void;
  onTimeChange: (employeeId: string, field: string, value: string) => void;
  onOvertimeChange: (employeeId: string, value: string) => void;
  onNotesChange: (employeeId: string, value: string) => void;
  onDeleteRecord?: (employeeId: string, attendanceId?: string) => Promise<void>;
  isModified: boolean;
}

export function DesktopAttendanceRow({
  record,
  onStatusChange,
  onTimeChange,
  onOvertimeChange,
  onNotesChange,
  onDeleteRecord,
  isModified,
}: DesktopAttendanceRowProps) {
  const isDisabled = record.status.toLowerCase() !== "present" || !record.isActive;
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (onDeleteRecord && record.attendance_id) {
      setIsDeleting(true);
      try {
        await onDeleteRecord(record.employee_id, record.attendance_id);
      } finally {
        setIsDeleting(false);
        setIsConfirmDialogOpen(false);
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log("Delete button clicked for:", record.fullName);
    setIsConfirmDialogOpen(true);
  };

  // Check if record can be deleted
  const canDelete = !!record.attendance_id && !record.markedForDeletion && !isDeleting;

  return (
    <TableRow
      className={cn(
        "transition-colors",
        isModified && "bg-yellow-50/50 dark:bg-yellow-900/20",
        !record.isActive && "bg-gray-100 dark:bg-gray-800/50",
        record.markedForDeletion && "opacity-50 bg-red-50/30 dark:bg-red-900/10"
      )}
    >
      <TableCell>
        <EmployeeInfo
          fullName={record.fullName}
          idIqamaNational={record.id_iqama_national}
          isActive={record.isActive}
          hasAttendanceRecord={record.hasAttendanceRecord}
        />
      </TableCell>
      <TableCell>
        <AttendanceStatus
          status={record.status}
          isActive={record.isActive}
          employeeId={record.employee_id}
          hasAttendanceRecord={record.hasAttendanceRecord}
          onStatusChange={onStatusChange}
        />
      </TableCell>
      <TableCell>
        <input
          type="text"
          className="w-full h-10 px-3 py-2 border rounded-md"
          placeholder="-- : --"
          value={record.startTime || ""}
          onChange={(e) => onTimeChange(record.employee_id, "startTime", e.target.value)}
          disabled={isDisabled || record.markedForDeletion}
        />
      </TableCell>
      <TableCell>
        <input
          type="text"
          className="w-full h-10 px-3 py-2 border rounded-md"
          placeholder="-- : --"
          value={record.endTime || ""}
          onChange={(e) => onTimeChange(record.employee_id, "endTime", e.target.value)}
          disabled={isDisabled || record.markedForDeletion}
        />
      </TableCell>
      <TableCell>
        <input
          type="number"
          min="0"
          step="0.5"
          className="w-full h-10 px-3 py-2 border rounded-md"
          value={record.overtimeHours !== null ? record.overtimeHours : ""}
          onChange={(e) => onOvertimeChange(record.employee_id, e.target.value)}
          disabled={isDisabled || record.markedForDeletion}
        />
      </TableCell>
      <TableCell>
        <textarea
          className="min-h-[50px] max-h-[100px] w-full px-3 py-2 border rounded-md"
          value={record.notes || ""}
          onChange={(e) => onNotesChange(record.employee_id, e.target.value)}
          disabled={isDisabled || record.markedForDeletion}
          placeholder="Add notes"
        />
      </TableCell>
      <TableCell className="relative">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "p-1 h-8 w-8 text-muted-foreground",
            canDelete ? "hover:text-destructive hover:bg-destructive/10" : "opacity-50 cursor-not-allowed",
            "z-10 relative"
          )}
          onClick={handleDeleteClick}
          disabled={!canDelete}
          title={!record.attendance_id ? "No attendance record to delete" : "Delete attendance record"}
          type="button" // Explicit type to prevent form submission
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
        
        <DeleteConfirmationDialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
          onConfirm={handleDelete}
          employeeName={record.fullName}
          isDeleting={isDeleting}
        />
      </TableCell>
    </TableRow>
  );
}
