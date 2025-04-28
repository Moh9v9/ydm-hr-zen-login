
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useEmployees } from "../use-employees";
import { 
  type AttendanceRecord, 
  type Filters, 
  type BulkUpdateData 
} from "@/types/attendance";
import { 
  fetchAttendanceRecords, 
  saveAttendanceRecords
} from "@/services/attendance-service";
import { combineEmployeeAndAttendanceData, filterAttendanceData } from "@/utils/attendance-utils";
import { useAttendanceActions } from "./use-attendance-actions";
import { useAttendanceModifications } from "./use-attendance-modifications";

export function useAttendance(selectedDate: Date, filters: Filters) {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [originalData, setOriginalData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { data: employees, isLoading: isLoadingEmployees, error: employeesError } = useEmployees();
  
  const { 
    modifiedRows,
    deletedRecords,
    updateAttendanceField, 
    markRecordForDeletion,
    applyBulkUpdate
  } = useAttendanceModifications(attendanceData, setAttendanceData);

  // Fetch attendance data
  useEffect(() => {
    const fetchData = async () => {
      if (isLoadingEmployees) return;
      if (employeesError) {
        setError(new Error("Failed to load employees data"));
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const attendanceRecords = await fetchAttendanceRecords(selectedDate);
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        
        if (employees) {
          // Process attendance data
          const combinedData = combineEmployeeAndAttendanceData(
            employees,
            attendanceRecords,
            formattedDate
          );
          
          // Ensure proper capitalization of status values
          const normalizedData = combinedData.map(record => ({
            ...record,
            status: record.status.charAt(0).toUpperCase() + record.status.slice(1).toLowerCase()
          }));
          
          setOriginalData([...normalizedData]);
          setAttendanceData([...normalizedData]);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(err instanceof Error ? err : new Error("Failed to load attendance data"));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [employees, isLoadingEmployees, employeesError, selectedDate]);
  
  // Filter the attendance data
  const filteredAttendanceData = useMemo(() => {
    return filterAttendanceData(attendanceData, filters);
  }, [attendanceData, filters]);
  
  const saveChanges = useAttendanceActions(
    modifiedRows, 
    attendanceData,
    selectedDate, 
    employees, 
    setOriginalData, 
    setAttendanceData,
    deletedRecords
  );
  
  // Calculate summary statistics
  const totalEmployees = filteredAttendanceData.filter(record => !record.markedForDeletion).length;
  const totalPresent = filteredAttendanceData.filter(
    record => record.status.toLowerCase() === "present" && !record.markedForDeletion
  ).length;
  const totalAbsent = totalEmployees - totalPresent;
  
  return {
    attendanceData: filteredAttendanceData,
    modifiedRows,
    deletedRecords,
    isLoading,
    error,
    updateAttendanceField,
    markRecordForDeletion,
    applyBulkUpdate,
    saveChanges,
    totalEmployees,
    totalPresent,
    totalAbsent,
  };
}

// Type exports
export type { AttendanceRecord };
