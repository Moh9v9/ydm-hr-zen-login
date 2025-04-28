
import { Badge } from "@/components/ui/badge";

interface EmployeeInfoProps {
  fullName: string;
  idNumber: string;
  isActive: boolean;
}

export function EmployeeInfo({ fullName, idNumber, isActive }: EmployeeInfoProps) {
  return (
    <div className="flex flex-col">
      <div className="font-medium flex items-center gap-2">
        {fullName}
        {!isActive && (
          <Badge 
            variant="outline" 
            className="ml-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
          >
            Inactive
          </Badge>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        {idNumber}
      </div>
    </div>
  );
}
