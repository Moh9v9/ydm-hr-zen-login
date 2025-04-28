
import { TableCell, TableRow } from "@/components/ui/table";
import { EmployeeInfo } from "./employee-info";
import { AttendanceStatus } from "./attendance-status";
import { cn } from "@/lib/utils";
import { type AttendanceRecord } from "@/types/attendance";

interface DesktopAttendanceRowProps {
  record: AttendanceRecord;
  onStatusChange: (employeeId: string, currentStatus: string, isActive: boolean) => void;
  onTimeChange: (employeeId: string, field: string, value: string) => void;
  onOvertimeChange: (employeeId: string, value: string) => void;
  onNotesChange: (employeeId: string, value: string) => void;
  isModified: boolean;
}

export function DesktopAttendanceRow({
  record,
  onStatusChange,
  onTimeChange,
  onOvertimeChange,
  onNotesChange,
  isModified,
}: DesktopAttendanceRowProps) {
  const isDisabled = record.status.toLowerCase() !== "present" || !record.isActive;
  
  return (
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
      <TableCell>
        <textarea
          className="min-h-[50px] max-h-[100px] w-full px-3 py-2 border rounded-md"
          value={record.notes || ""}
          onChange={(e) => onNotesChange(record.employee_id, e.target.value)}
          disabled={isDisabled}
          placeholder="Add notes"
        />
      </TableCell>
    </TableRow>
  );
}
