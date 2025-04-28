
import { AlertTriangle } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type AttendanceRecord } from "@/types/attendance";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileAttendanceRow } from "./table/mobile-attendance-row";
import { DesktopAttendanceRow } from "./table/desktop-attendance-row";
import { AttendanceTableEmptyState } from "./table/attendance-table-empty-state";
import { AttendanceTableSkeleton } from "./table/attendance-table-skeleton";

interface AttendanceTableProps {
  attendanceData: AttendanceRecord[];
  updateAttendanceField: (employeeId: string, field: string, value: any) => void;
  isLoading: boolean;
  modifiedRows: Set<string>;
}

export function AttendanceTable({
  attendanceData,
  updateAttendanceField,
  isLoading,
  modifiedRows,
}: AttendanceTableProps) {
  const isMobile = useIsMobile();

  const handleToggleStatus = (employeeId: string, currentStatus: string, isActive: boolean) => {
    if (!isActive) return;
    const newStatus = currentStatus.toLowerCase() === "present" ? "Absent" : "Present";
    updateAttendanceField(employeeId, "status", newStatus);

    if (newStatus === "Absent") {
      updateAttendanceField(employeeId, "startTime", null);
      updateAttendanceField(employeeId, "endTime", null);
      updateAttendanceField(employeeId, "overtimeHours", null);
    } else {
      // Set default times when changing to Present
      updateAttendanceField(employeeId, "startTime", "07:00 am");
      updateAttendanceField(employeeId, "endTime", "05:00 pm");
    }
  };

  const handleTimeChange = (employeeId: string, field: string, value: string) => {
    updateAttendanceField(employeeId, field, value || null);
  };

  const handleOvertimeChange = (employeeId: string, value: string) => {
    const numericValue = value === "" ? null : parseFloat(value);
    updateAttendanceField(employeeId, "overtimeHours", numericValue);
  };

  const handleNotesChange = (employeeId: string, value: string) => {
    updateAttendanceField(employeeId, "notes", value || null);
  };

  if (isLoading) {
    return <AttendanceTableSkeleton />;
  }

  if (attendanceData.length === 0) {
    return <AttendanceTableEmptyState />;
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {attendanceData.map((record) => (
          <MobileAttendanceRow
            key={record.employee_id}
            record={record}
            onStatusChange={handleToggleStatus}
            onTimeChange={handleTimeChange}
            onOvertimeChange={handleOvertimeChange}
            onNotesChange={handleNotesChange}
            isModified={modifiedRows.has(record.employee_id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow-sm overflow-hidden bg-card">
      <ScrollArea className="h-[calc(100vh-26rem)]">
        <div className="min-w-[900px] relative">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-border">
              <TableRow>
                <TableHead className="w-[250px] bg-card">Employee</TableHead>
                <TableHead className="w-[150px] bg-card">Status</TableHead>
                <TableHead className="w-[120px] bg-card">Start Time</TableHead>
                <TableHead className="w-[120px] bg-card">End Time</TableHead>
                <TableHead className="w-[120px] bg-card">Overtime (hrs)</TableHead>
                <TableHead className="w-[200px] bg-card">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record) => (
                <DesktopAttendanceRow
                  key={record.employee_id}
                  record={record}
                  onStatusChange={handleToggleStatus}
                  onTimeChange={handleTimeChange}
                  onOvertimeChange={handleOvertimeChange}
                  onNotesChange={handleNotesChange}
                  isModified={modifiedRows.has(record.employee_id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
