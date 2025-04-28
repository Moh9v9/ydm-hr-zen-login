
import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Filter, AlertTriangle, Check, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AttendanceFilters } from "@/components/attendance/attendance-filters";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { UpdateAllModal } from "@/components/attendance/update-all-modal";
import { useAttendance } from "@/hooks/use-attendance";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    project: "",
    location: "",
    paymentType: "",
    sponsorship: "",
  });
  const [isUpdateAllModalOpen, setIsUpdateAllModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    attendanceData,
    modifiedRows,
    isLoading,
    error,
    updateAttendanceField,
    applyBulkUpdate,
    saveChanges,
    totalEmployees,
    totalPresent,
    totalAbsent,
  } = useAttendance(selectedDate, filters);

  // If there's an error, show it
  useEffect(() => {
    if (error) {
      toast.error("Error loading attendance data", {
        description: error.message,
      });
    }
  }, [error]);

  const handleSaveChanges = async () => {
    if (modifiedRows.size === 0) {
      toast.info("No changes to save");
      return;
    }
    
    setIsSaving(true);
    try {
      await saveChanges();
      toast.success("Attendance records saved successfully");
    } catch (error) {
      toast.error("Failed to save attendance", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = useMemo(() => {
    return format(selectedDate, "EEEE, MMMM d, yyyy");
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Attendance</h2>
        <p className="text-muted-foreground">
          Manage daily attendance for employees
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <AttendanceFilters
          filters={filters}
          setFilters={setFilters}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {modifiedRows.size > 0 && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:text-yellow-400 dark:border-yellow-900">
                {modifiedRows.size} {modifiedRows.size === 1 ? 'change' : 'changes'} pending
              </Badge>
            )}
            
            <Button
              variant="outline"
              onClick={() => setIsUpdateAllModalOpen(true)}
              disabled={isLoading}
            >
              Update All
            </Button>
            
            <Button
              onClick={handleSaveChanges}
              disabled={modifiedRows.size === 0 || isSaving}
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-500">
                Present
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPresent}</div>
              <p className="text-xs text-muted-foreground">
                {totalEmployees > 0 ? Math.round((totalPresent / totalEmployees) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-500">
                Absent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAbsent}</div>
              <p className="text-xs text-muted-foreground">
                {totalEmployees > 0 ? Math.round((totalAbsent / totalEmployees) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        <AttendanceTable
          attendanceData={attendanceData}
          updateAttendanceField={updateAttendanceField}
          isLoading={isLoading}
        />
      </div>

      <UpdateAllModal 
        open={isUpdateAllModalOpen}
        onOpenChange={setIsUpdateAllModalOpen}
        onUpdate={applyBulkUpdate}
      />
    </div>
  );
}
