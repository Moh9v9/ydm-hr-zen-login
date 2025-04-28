
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EmployeeInfoProps {
  fullName: string;
  idIqamaNational: string;
  isActive: boolean;
  hasAttendanceRecord: boolean;
}

export function EmployeeInfo({
  fullName,
  idIqamaNational,
  isActive,
  hasAttendanceRecord,
}: EmployeeInfoProps) {
  return (
    <div className="flex flex-col">
      <div className="font-medium flex items-center gap-2">
        {fullName}
        {!hasAttendanceRecord && (
          <TooltipProvider>
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
          </TooltipProvider>
        )}
        {!isActive && (
          <Badge
            variant="outline"
            className="ml-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
          >
            Inactive
          </Badge>
        )}
      </div>
      <div className="text-xs text-muted-foreground">{idIqamaNational}</div>
    </div>
  );
}
