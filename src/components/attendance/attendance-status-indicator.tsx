
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AttendanceStatusIndicatorProps {
  type: "no-record" | "inactive" | "modified";
}

export function AttendanceStatusIndicator({ type }: AttendanceStatusIndicatorProps) {
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
            <p>No attendance record for today</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (type === "inactive") {
    return (
      <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200">
        Inactive
      </Badge>
    );
  }

  if (type === "modified") {
    return (
      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
        Modified
      </Badge>
    );
  }

  return null;
}
