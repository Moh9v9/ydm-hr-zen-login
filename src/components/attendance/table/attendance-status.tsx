
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AttendanceStatusProps {
  status: string;
  isActive: boolean;
  employeeId: string;
  hasAttendanceRecord: boolean;
  onStatusChange: (employeeId: string, currentStatus: string, isActive: boolean) => void;
}

export function AttendanceStatus({
  status,
  isActive,
  employeeId,
  hasAttendanceRecord,
  onStatusChange,
}: AttendanceStatusProps) {
  const isPresent = status.toLowerCase() === "present";

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Switch
          checked={isPresent}
          onCheckedChange={() => onStatusChange(employeeId, status, isActive)}
          disabled={!isActive}
        />
        <span
          className={cn(
            "font-medium text-sm transition-colors",
            isPresent ? "text-[#22C55E]" : "text-[#EF4444]"
          )}
        >
          {status}
        </span>
      </div>
      {!hasAttendanceRecord && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>No attendance record for today</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
