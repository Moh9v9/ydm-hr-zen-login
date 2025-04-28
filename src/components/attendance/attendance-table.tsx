
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type AttendanceRecord } from "@/hooks/use-attendance";
import { useIsMobile } from "@/hooks/use-mobile";
import { AttendanceStatus } from "./table/attendance-status";
import { EmployeeInfo } from "./table/employee-info";
import { AttendanceInputs } from "./table/attendance-inputs";
import { MobileAttendanceRow } from "./table/mobile-attendance-row";
import { cn } from "@/lib/utils";

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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (employeeId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

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
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-72 bg-muted rounded"></div>
          <div className="h-24 w-full max-w-3xl bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (attendanceData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
        </div>
        <h3 className="text-lg font-medium">No attendance records found</h3>
        <p className="text-muted-foreground mt-1">Try adjusting your filters or date selection</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {attendanceData.map((record) => (
          <MobileAttendanceRow
            key={record.employee_id}
            record={record}
            isExpanded={expandedRows.has(record.employee_id)}
            onToggleExpand={toggleRowExpansion}
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
                <TableRow
                  key={record.employee_id}
                  className={cn(
                    "transition-colors",
                    modifiedRows.has(record.employee_id) &&
                      "bg-yellow-50/50 dark:bg-yellow-900/20",
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
                      onStatusChange={handleToggleStatus}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      className="w-full h-10 px-3 py-2 border rounded-md"
                      placeholder="-- : --"
                      value={record.startTime || ""}
                      onChange={(e) => handleTimeChange(record.employee_id, "startTime", e.target.value)}
                      disabled={record.status.toLowerCase() !== "present" || !record.isActive}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      className="w-full h-10 px-3 py-2 border rounded-md"
                      placeholder="-- : --"
                      value={record.endTime || ""}
                      onChange={(e) => handleTimeChange(record.employee_id, "endTime", e.target.value)}
                      disabled={record.status.toLowerCase() !== "present" || !record.isActive}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      className="w-full h-10 px-3 py-2 border rounded-md"
                      value={record.overtimeHours !== null ? record.overtimeHours : ""}
                      onChange={(e) => handleOvertimeChange(record.employee_id, e.target.value)}
                      disabled={record.status.toLowerCase() !== "present" || !record.isActive}
                    />
                  </TableCell>
                  <TableCell>
                    <textarea
                      className="min-h-[50px] max-h-[100px] w-full px-3 py-2 border rounded-md"
                      value={record.notes || ""}
                      onChange={(e) => handleNotesChange(record.employee_id, e.target.value)}
                      disabled={record.status.toLowerCase() !== "present" || !record.isActive}
                      placeholder="Add notes"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
