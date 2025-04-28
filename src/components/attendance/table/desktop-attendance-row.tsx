
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { EmployeeInfo } from "./employee-info";
import { AttendanceStatus } from "./attendance-status";
import { cn } from "@/lib/utils";
import { type AttendanceRecord } from "@/types/attendance";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DesktopAttendanceRowProps {
  record: AttendanceRecord;
  onStatusChange: (employeeId: string, currentStatus: string, isActive: boolean) => void;
  onTimeChange: (employeeId: string, field: string, value: string) => void;
  onOvertimeChange: (employeeId: string, value: string) => void;
  onNotesChange: (employeeId: string, value: string) => void;
  onDeleteRecord: (attendanceId: string | undefined) => void;
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
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const isDisabled = record.status.toLowerCase() !== "present" || !record.isActive;
  const canDelete = record.hasAttendanceRecord && record.attendance_id;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canDelete) {
      setIsConfirmDialogOpen(true);
    }
  };

  const handleDelete = async () => {
    if (canDelete && record.attendance_id) {
      onDeleteRecord(record.attendance_id);
    }
  };

  if (record.markedForDeletion) {
    return null; // Don't render deleted rows
  }

  return (
    <>
      <TableRow
        className={cn(
          "transition-colors",
          isModified && "bg-yellow-50/50 dark:bg-yellow-900/20",
          !record.isActive && "bg-gray-100 dark:bg-gray-800/50"
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
            disabled={isDisabled}
          />
        </TableCell>
        <TableCell>
          <input
            type="text"
            className="w-full h-10 px-3 py-2 border rounded-md"
            placeholder="-- : --"
            value={record.endTime || ""}
            onChange={(e) => onTimeChange(record.employee_id, "endTime", e.target.value)}
            disabled={isDisabled}
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
            disabled={isDisabled}
          />
        </TableCell>
        <TableCell className="col-span-2">
          <textarea
            className="min-h-[50px] max-h-[100px] w-full px-3 py-2 border rounded-md"
            value={record.notes || ""}
            onChange={(e) => onNotesChange(record.employee_id, e.target.value)}
            disabled={isDisabled}
            placeholder="إضافة ملاحظات"
          />
        </TableCell>
        <TableCell className="w-10 pl-2 pr-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={!canDelete}
                  className={cn(
                    "rounded-full p-2 transition-colors",
                    canDelete ? 
                      "text-red-500 hover:bg-red-50 hover:text-red-600 active:text-red-700" : 
                      "text-gray-300 cursor-not-allowed"
                  )}
                  aria-label="حذف سجل الحضور"
                >
                  <Trash2 size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>حذف سجل الحضور</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
      </TableRow>

      <DeleteConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleDelete}
        attendanceId={record.attendance_id}
        employeeName={record.fullName}
      />
    </>
  );
}
