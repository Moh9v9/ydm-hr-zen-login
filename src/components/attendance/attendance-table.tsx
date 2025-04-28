import { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AttendanceStatusIndicator } from "@/components/attendance/attendance-status-indicator";
import { type AttendanceRecord } from "@/hooks/use-attendance";
interface AttendanceTableProps {
  attendanceData: AttendanceRecord[];
  updateAttendanceField: (employeeId: string, field: string, value: any) => void;
  isLoading: boolean;
}
export function AttendanceTable({
  attendanceData,
  updateAttendanceField,
  isLoading
}: AttendanceTableProps) {
  const handleToggleStatus = (employeeId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Present" ? "Absent" : "Present";
    updateAttendanceField(employeeId, "status", newStatus);
  };
  const handleTimeChange = (employeeId: string, field: string, value: string) => {
    updateAttendanceField(employeeId, field, value || null);
  };
  const handleOvertimeChange = (employeeId: string, value: string) => {
    // Convert to number or null if empty
    const numericValue = value === "" ? null : parseFloat(value);
    updateAttendanceField(employeeId, "overtimeHours", numericValue);
  };
  const handleNotesChange = (employeeId: string, value: string) => {
    updateAttendanceField(employeeId, "notes", value || null);
  };
  if (isLoading) {
    return <div className="p-8 flex justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-72 bg-muted rounded"></div>
          <div className="h-24 w-full max-w-3xl bg-muted rounded"></div>
        </div>
      </div>;
  }
  if (attendanceData.length === 0) {
    return <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
        </div>
        <h3 className="text-lg font-medium">No attendance records found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your filters or date selection
        </p>
      </div>;
  }
  return <div className="rounded-md border overflow-hidden">
      <ScrollArea className="h-[calc(100vh-26rem)]">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-[250px]">Employee</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[120px]">Start Time</TableHead>
                <TableHead className="w-[120px]">End Time</TableHead>
                <TableHead className="w-[120px]">Overtime (hrs)</TableHead>
                <TableHead className="w-[200px]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map(record => <TableRow key={record.employee_id} className={`${!record.isActive ? 'bg-red-100/10 dark:bg-red-900/10' : ''}`}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="font-medium flex items-center gap-2">
                        {record.fullName}
                        {!record.isActive && <Badge variant="destructive" className="ml-1 text-xs">
                            Inactive
                          </Badge>}
                        {!record.hasAttendanceRecord && <AttendanceStatusIndicator type="no-record" />}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {record.id_iqama_national}
                      </div>
                      
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={record.status === "Present"} onCheckedChange={() => handleToggleStatus(record.employee_id, record.status)} />
                      <span className={record.status === "Present" ? "text-green-600" : "text-red-500"}>
                        {record.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input type="time" value={record.startTime || ""} onChange={e => handleTimeChange(record.employee_id, "startTime", e.target.value)} disabled={record.status !== "Present"} />
                  </TableCell>
                  <TableCell>
                    <Input type="time" value={record.endTime || ""} onChange={e => handleTimeChange(record.employee_id, "endTime", e.target.value)} disabled={record.status !== "Present"} />
                  </TableCell>
                  <TableCell>
                    <Input type="number" min="0" step="0.5" value={record.overtimeHours !== null ? record.overtimeHours : ""} onChange={e => handleOvertimeChange(record.employee_id, e.target.value)} disabled={record.status !== "Present"} />
                  </TableCell>
                  <TableCell>
                    <Textarea value={record.notes || ""} onChange={e => handleNotesChange(record.employee_id, e.target.value)} disabled={record.status !== "Present"} className="min-h-[50px] max-h-[100px]" placeholder="Add notes" />
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>;
}