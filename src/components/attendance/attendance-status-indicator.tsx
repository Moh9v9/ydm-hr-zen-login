
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AttendanceStatusIndicatorProps {
  type: "no-record" | "inactive" | "modified";
  tooltipText?: string; // Optional custom tooltip text
  className?: string; // Allow custom styling
}

export function AttendanceStatusIndicator({ 
  type, 
  tooltipText, 
  className 
}: AttendanceStatusIndicatorProps) {
  if (type === "no-record") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText || "No attendance record for today"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (type === "inactive") {
    return (
      <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
        Inactive
      </Badge>
    );
  }

  if (type === "modified") {
    return (
      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
        Modified
      </Badge>
    );
  }

  return null;
}
