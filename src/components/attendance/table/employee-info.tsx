
import { Badge } from "@/components/ui/badge";
import { AttendanceStatusIndicator } from "@/components/attendance/attendance-status-indicator";

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
        {!hasAttendanceRecord && <AttendanceStatusIndicator type="no-record" />}
        {!isActive && <AttendanceStatusIndicator type="inactive" />}
      </div>
      <div className="text-xs text-muted-foreground">{idIqamaNational}</div>
    </div>
  );
}
