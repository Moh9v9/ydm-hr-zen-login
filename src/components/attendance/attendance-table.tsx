import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { type AttendanceRecord } from "@/hooks/use-attendance";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    if (!isActive) return; // Prevent toggling for inactive employees
    const newStatus = currentStatus.toLowerCase() === "present" ? "Absent" : "Present";
    updateAttendanceField(employeeId, "status", newStatus);

    // If changing to Absent, clear time-related fields
    if (newStatus === "Absent") {
      updateAttendanceField(employeeId, "startTime", null);
      updateAttendanceField(employeeId, "endTime", null);
      updateAttendanceField(employeeId, "overtimeHours", null);
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

  // Update the mobile view
  if (isMobile) {
    return <div className="space-y-4">
        {attendanceData.map(record => {
        const isPresent = record.status.toLowerCase() === "present";
        return <Collapsible key={record.employee_id} open={expandedRows.has(record.employee_id)} onOpenChange={() => toggleRowExpansion(record.employee_id)} className={cn("border rounded-lg overflow-hidden transition-colors", modifiedRows.has(record.employee_id) && "border-yellow-500 dark:border-yellow-600", !record.isActive && "bg-gray-100 dark:bg-gray-800/50")}>
              <div className="p-4">
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {record.fullName}
                      {!record.hasAttendanceRecord && <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex">
                                <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>No attendance record for today</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>}
                      {!record.isActive && <Badge variant="outline" className="ml-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800">
                          Inactive
                        </Badge>}
                      {modifiedRows.has(record.employee_id) && <Badge variant="outline" className="ml-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
                          Modified
                        </Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {record.id_iqama_national}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch checked={isPresent} onCheckedChange={() => handleToggleStatus(record.employee_id, record.status, record.isActive)} disabled={!record.isActive} />
                      <span className={cn("font-medium text-sm transition-colors", isPresent ? "text-[#22C55E]" : "text-[#EF4444]")}>
                        {record.status}
                      </span>
                    </div>
                    {!record.hasAttendanceRecord && <AlertTriangle className="h-4 w-4 text-[#EF4444]" />}
                    {expandedRows.has(record.employee_id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Start Time</label>
                      <Input type="text" placeholder="-- : --" value={record.startTime || ""} onChange={e => handleTimeChange(record.employee_id, "startTime", e.target.value)} disabled={record.status.toLowerCase() !== "present" || !record.isActive} className="w-full" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">End Time</label>
                      <Input type="text" placeholder="-- : --" value={record.endTime || ""} onChange={e => handleTimeChange(record.employee_id, "endTime", e.target.value)} disabled={record.status.toLowerCase() !== "present" || !record.isActive} className="w-full" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Overtime (hrs)</label>
                      <Input type="number" min="0" step="0.5" value={record.overtimeHours !== null ? record.overtimeHours : ""} onChange={e => handleOvertimeChange(record.employee_id, e.target.value)} disabled={record.status.toLowerCase() !== "present" || !record.isActive} className="w-full" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Notes</label>
                      <Textarea value={record.notes || ""} onChange={e => handleNotesChange(record.employee_id, e.target.value)} disabled={record.status.toLowerCase() !== "present" || !record.isActive} className="min-h-[80px] max-h-[120px] w-full" placeholder="Add notes" />
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>;
      })}
      </div>;
  }

  // Update the desktop view with fixed header
  return <div className="rounded-md border shadow-sm overflow-hidden bg-card">
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
              {attendanceData.map(record => {
              const isPresent = record.status.toLowerCase() === "present";
              return <TableRow key={record.employee_id} className={cn("transition-colors", modifiedRows.has(record.employee_id) && "bg-yellow-50/50 dark:bg-yellow-900/20", !record.isActive && "bg-gray-100 dark:bg-gray-800/50")}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium flex items-center gap-2">
                          {record.fullName}
                          {!record.hasAttendanceRecord && <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="inline-flex">
                                    <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>No attendance record for today</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>}
                          {!record.isActive && <Badge variant="outline" className="ml-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800">
                              Inactive
                            </Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {record.id_iqama_national}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Switch checked={isPresent} onCheckedChange={() => handleToggleStatus(record.employee_id, record.status, record.isActive)} disabled={!record.isActive} />
                          <span className={cn("font-medium text-sm transition-colors", isPresent ? "text-[#22C55E]" : "text-[#EF4444]")}>
                            {record.status}
                          </span>
                        </div>
                        {!record.hasAttendanceRecord && <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center">
                                  
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>No attendance record for today</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="-- : --" value={record.startTime || ""} onChange={e => handleTimeChange(record.employee_id, "startTime", e.target.value)} disabled={record.status.toLowerCase() !== "present" || !record.isActive} />
                    </TableCell>
                    <TableCell>
                      <Input type="text" placeholder="-- : --" value={record.endTime || ""} onChange={e => handleTimeChange(record.employee_id, "endTime", e.target.value)} disabled={record.status.toLowerCase() !== "present" || !record.isActive} />
                    </TableCell>
                    <TableCell>
                      <Input type="number" min="0" step="0.5" value={record.overtimeHours !== null ? record.overtimeHours : ""} onChange={e => handleOvertimeChange(record.employee_id, e.target.value)} disabled={record.status.toLowerCase() !== "present" || !record.isActive} />
                    </TableCell>
                    <TableCell>
                      <Textarea value={record.notes || ""} onChange={e => handleNotesChange(record.employee_id, e.target.value)} disabled={record.status.toLowerCase() !== "present" || !record.isActive} className="min-h-[50px] max-h-[100px]" placeholder="Add notes" />
                    </TableCell>
                  </TableRow>;
            })}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>;
}
