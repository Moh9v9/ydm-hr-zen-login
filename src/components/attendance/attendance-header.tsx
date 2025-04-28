
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface AttendanceHeaderProps {
  selectedDate: Date;
}

export function AttendanceHeader({ selectedDate }: AttendanceHeaderProps) {
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Attendance</h2>
          <p className="text-muted-foreground">
            Manage daily attendance for employees
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
