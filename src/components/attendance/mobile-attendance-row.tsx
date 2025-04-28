
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { type AttendanceRecord } from "@/types/attendance";
import { StatusControls } from "./status-controls";
import { EmployeeInfo } from "./employee-info";
import { TimeInputs } from "./time-inputs";

interface MobileAttendanceRowProps {
  record: AttendanceRecord;
  isExpanded: boolean;
  isModified: boolean;
  onToggleExpand: () => void;
  onToggleStatus: () => void;
  onTimeChange: (field: string, value: string) => void;
  onNotesChange: (value: string) => void;
}

export function MobileAttendanceRow({
  record,
  isExpanded,
  isModified,
  onToggleExpand,
  onToggleStatus,
  onTimeChange,
  onNotesChange,
}: MobileAttendanceRowProps) {
  const isPresent = record.status.toLowerCase() === "present";
  
  return (
    <Collapsible 
      open={isExpanded}
      onOpenChange={onToggleExpand}
      className={cn(
        "border rounded-lg overflow-hidden transition-colors",
        isModified && "border-yellow-500 dark:border-yellow-600",
        !record.isActive && "bg-gray-100 dark:bg-gray-800/50"
      )}
    >
      <div className="p-4">
        <CollapsibleTrigger className="flex w-full items-center justify-between">
          <EmployeeInfo
            fullName={record.fullName}
            idNumber={record.id_iqama_national}
            isActive={record.isActive}
          />
          <div className="flex items-center gap-3">
            <StatusControls
              status={record.status}
              isActive={record.isActive}
              hasAttendanceRecord={record.hasAttendanceRecord}
              onToggleStatus={onToggleStatus}
            />
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Start Time</label>
              <Input 
                type="text" 
                placeholder="-- : --" 
                value={record.startTime || ""} 
                onChange={e => onTimeChange("startTime", e.target.value)}
                disabled={!isPresent || !record.isActive} 
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">End Time</label>
              <Input 
                type="text" 
                placeholder="-- : --" 
                value={record.endTime || ""} 
                onChange={e => onTimeChange("endTime", e.target.value)}
                disabled={!isPresent || !record.isActive} 
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Overtime (hrs)</label>
              <Input 
                type="number" 
                min="0" 
                step="0.5" 
                value={record.overtimeHours !== null ? record.overtimeHours : ""}
                onChange={e => onTimeChange("overtimeHours", e.target.value)}
                disabled={!isPresent || !record.isActive} 
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Notes</label>
              <Textarea 
                value={record.notes || ""} 
                onChange={e => onNotesChange(e.target.value)}
                disabled={!isPresent || !record.isActive} 
                className="min-h-[80px] max-h-[120px] w-full" 
                placeholder="Add notes" 
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
