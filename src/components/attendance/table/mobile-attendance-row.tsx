
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type AttendanceRecord } from "@/types/attendance";
import { AttendanceStatus } from "./attendance-status";
import { EmployeeInfo } from "./employee-info";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MobileAttendanceRowProps {
  record: AttendanceRecord;
  onStatusChange: (employeeId: string, currentStatus: string, isActive: boolean) => void;
  onTimeChange: (employeeId: string, field: string, value: string) => void;
  onOvertimeChange: (employeeId: string, value: string) => void;
  onNotesChange: (employeeId: string, value: string) => void;
  onDeleteRecord: (attendanceId: string | undefined) => void;
  isModified: boolean;
}

export function MobileAttendanceRow({
  record,
  onStatusChange,
  onTimeChange,
  onOvertimeChange,
  onNotesChange,
  onDeleteRecord,
  isModified,
}: MobileAttendanceRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const isPresent = record.status.toLowerCase() === "present";
  const canDelete = Boolean(record.attendance_id);
  
  const handleDeleteClick = () => {
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
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className={cn(
          "border rounded-lg overflow-hidden transition-colors",
          isModified && "border-yellow-500 dark:border-yellow-600",
          !record.isActive && "bg-gray-100 dark:bg-gray-800/50"
        )}
      >
        <div className="p-4">
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <div>
              <EmployeeInfo
                fullName={record.fullName}
                idIqamaNational={record.id_iqama_national}
                isActive={record.isActive}
                hasAttendanceRecord={record.hasAttendanceRecord}
              />
              {isModified && (
                <Badge
                  variant="outline"
                  className="ml-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                >
                  Modified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <AttendanceStatus
                status={record.status}
                isActive={record.isActive}
                employeeId={record.employee_id}
                hasAttendanceRecord={record.hasAttendanceRecord}
                onStatusChange={onStatusChange}
              />
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Start Time
                </label>
                <Input
                  type="text"
                  placeholder="-- : --"
                  value={record.startTime || ""}
                  onChange={(e) => onTimeChange(record.employee_id, "startTime", e.target.value)}
                  disabled={!isPresent || !record.isActive}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  End Time
                </label>
                <Input
                  type="text"
                  placeholder="-- : --"
                  value={record.endTime || ""}
                  onChange={(e) => onTimeChange(record.employee_id, "endTime", e.target.value)}
                  disabled={!isPresent || !record.isActive}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Overtime (hrs)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={record.overtimeHours !== null ? record.overtimeHours : ""}
                  onChange={(e) => onOvertimeChange(record.employee_id, e.target.value)}
                  disabled={!isPresent || !record.isActive}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Notes</label>
                <Textarea
                  value={record.notes || ""}
                  onChange={(e) => onNotesChange(record.employee_id, e.target.value)}
                  disabled={!isPresent || !record.isActive}
                  className="min-h-[80px] max-h-[120px] w-full"
                  placeholder="Add notes"
                />
              </div>
              <div className="flex justify-end pt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleDeleteClick}
                        disabled={!canDelete}
                        className={cn(
                          "rounded-full p-2.5 transition-colors",
                          canDelete ? 
                            "text-red-500 hover:bg-red-50 hover:text-red-600 active:text-red-700" : 
                            "text-gray-300 cursor-not-allowed"
                        )}
                        aria-label="Delete attendance record"
                      >
                        <Trash2 size={20} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Attendance</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

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
