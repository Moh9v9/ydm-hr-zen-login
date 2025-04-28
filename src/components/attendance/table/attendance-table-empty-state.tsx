
import { AlertTriangle } from "lucide-react";

export function AttendanceTableEmptyState() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
      </div>
      <h3 className="text-lg font-medium">No attendance records found</h3>
      <p className="text-muted-foreground mt-1">Try adjusting your filters or date selection</p>
    </div>
  );
}
