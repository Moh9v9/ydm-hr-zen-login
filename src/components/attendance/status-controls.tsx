
import { AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface StatusControlsProps {
  status: string;
  isActive: boolean;
  hasAttendanceRecord: boolean;
  onToggleStatus: () => void;
}

export function StatusControls({
  status,
  isActive,
  hasAttendanceRecord,
  onToggleStatus,
}: StatusControlsProps) {
  const isPresent = status.toLowerCase() === "present";
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Switch 
          checked={isPresent}
          onCheckedChange={onToggleStatus}
          disabled={!isActive}
          className={cn(
            "transition-colors relative",
            isPresent
              ? "[&>span]:bg-green-500 bg-green-500 dark:bg-green-600 border-green-300 dark:border-green-700" 
              : "[&>span]:bg-red-500 bg-red-500 dark:bg-red-600 border-red-300 dark:border-red-700"
          )}
        />
        <span className={cn(
          "font-medium text-sm",
          isPresent
            ? "text-green-600 dark:text-green-400" 
            : "text-red-600 dark:text-red-400"
        )}>
          {status}
        </span>
      </div>
      {!hasAttendanceRecord && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
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
