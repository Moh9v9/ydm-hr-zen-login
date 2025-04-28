
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type AttendanceRecord } from "@/types/attendance";
import { AttendanceStatus } from "./attendance-status";
import { EmployeeInfo } from "./employee-info";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";

interface MobileAttendanceRowProps {
  record: AttendanceRecord;
  onStatusChange: (employeeId: string, currentStatus: string, isActive: boolean) => void;
  onTimeChange: (employeeId: string, field: string, value: string) => void;
  onOvertimeChange: (employeeId: string, value: string) => void;
  onNotesChange: (employeeId: string, value: string) => void;
  onDeleteRecord?: (employeeId: string, attendanceId?: string) => void;
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
  const [isDeleting, setIsDeleting] = useState(false);
  const isPresent = record.status.toLowerCase() === "present";
  
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

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className={cn(
        "border rounded-lg overflow-hidden transition-colors",
        isModified && "border-yellow-500 dark:border-yellow-600",
        !record.isActive && "bg-gray-100 dark:bg-gray-800/50",
        record.markedForDeletion && "opacity-50 border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/10"
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
            {record.markedForDeletion && (
              <Badge
                variant="outline"
                className="ml-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
              >
                Deleted
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
                disabled={!isPresent || !record.isActive || record.markedForDeletion}
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
                disabled={!isPresent || !record.isActive || record.markedForDeletion}
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
                disabled={!isPresent || !record.isActive || record.markedForDeletion}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Notes</label>
              <Textarea
                value={record.notes || ""}
                onChange={(e) => onNotesChange(record.employee_id, e.target.value)}
                disabled={!isPresent || !record.isActive || record.markedForDeletion}
                className="min-h-[80px] max-h-[120px] w-full"
                placeholder="Add notes"
              />
            </div>
            
            {record.attendance_id && (
              <div className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex w-full justify-center items-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border"
                  onClick={() => setIsConfirmDialogOpen(true)}
                  disabled={record.markedForDeletion || isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{isDeleting ? "Deleting..." : "Delete Record"}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
      
      <DeleteConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleDelete}
        employeeName={record.fullName}
        isDeleting={isDeleting}
      />
    </Collapsible>
  );
}
