
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type AttendanceRecord } from "@/hooks/use-attendance";
import { useIsMobile } from "@/hooks/use-mobile";
import { StatusControls } from "./status-controls";
import { EmployeeInfo } from "./employee-info";
import { TimeInputs } from "./time-inputs";
import { MobileAttendanceRow } from "./mobile-attendance-row";

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
  modifiedRows
}: AttendanceTableProps) {
  const isMobile = useIsMobile();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  const toggleRowExpansion = (employeeId: string) => {
    setExpandedRows(prev => {
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
    const newStatus = currentStatus === "Present" ? "Absent" : "Present";
    updateAttendanceField(employeeId, "status", newStatus);
    
    if (newStatus === "Absent") {
      updateAttendanceField(employeeId, "startTime", null);
      updateAttendanceField(employeeId, "endTime", null);
      updateAttendanceField(employeeId, "overtimeHours", null);
    }
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
        <h3 className="text-lg font-medium">No attendance records found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your filters or date selection
        </p>
      </div>
    );
  }
  
  // Mobile View
  if (isMobile) {
    return (
      <div className="space-y-4">
        {attendanceData.map((record) => (
          <MobileAttendanceRow
            key={record.employee_id}
            record={record}
            isExpanded={expandedRows.has(record.employee_id)}
            isModified={modifiedRows.has(record.employee_id)}
            onToggleExpand={() => toggleRowExpansion(record.employee_id)}
            onToggleStatus={() => handleToggleStatus(record.employee_id, record.status, record.isActive)}
            onTimeChange={(field, value) => updateAttendanceField(record.employee_id, field, value)}
            onNotesChange={(value) => updateAttendanceField(record.employee_id, "notes", value)}
          />
        ))}
      </div>
    );
  }
  
  // Desktop View
  return (
    <div className="rounded-md border shadow-sm overflow-hidden bg-card">
      <ScrollArea className="h-[calc(100vh-26rem)]">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-[250px]">Employee</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[120px]">Start Time</TableHead>
                <TableHead className="w-[120px]">End Time</TableHead>
                <TableHead className="w-[120px]">Overtime (hrs)</TableHead>
                <TableHead className="w-[200px]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map(record => {
                const isPresent = record.status.toLowerCase() === "present";
                
                return (
                  <TableRow key={record.employee_id}>
                    <TableCell>
                      <EmployeeInfo
                        fullName={record.fullName}
                        idNumber={record.id_iqama_national}
                        isActive={record.isActive}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusControls
                        status={record.status}
                        isActive={record.isActive}
                        hasAttendanceRecord={record.hasAttendanceRecord}
                        onToggleStatus={() => handleToggleStatus(record.employee_id, record.status, record.isActive)}
                      />
                    </TableCell>
                    <TableCell>
                      <TimeInputs
                        startTime={record.startTime}
                        endTime={record.endTime}
                        overtimeHours={record.overtimeHours}
                        isEditable={isPresent && record.isActive}
                        onStartTimeChange={(value) => updateAttendanceField(record.employee_id, "startTime", value)}
                        onEndTimeChange={(value) => updateAttendanceField(record.employee_id, "endTime", value)}
                        onOvertimeChange={(value) => updateAttendanceField(record.employee_id, "overtimeHours", value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea 
                        value={record.notes || ""} 
                        onChange={e => updateAttendanceField(record.employee_id, "notes", e.target.value)}
                        disabled={!isPresent || !record.isActive} 
                        className="min-h-[50px] max-h-[100px]" 
                        placeholder="Add notes" 
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
