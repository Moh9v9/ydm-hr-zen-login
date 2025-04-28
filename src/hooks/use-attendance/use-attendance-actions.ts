
import { useCallback } from "react";
import { format } from "date-fns";
import { Employee } from "../use-employees";
import { AttendanceRecord } from "@/types/attendance";
import { 
  saveAttendanceRecords, 
  fetchAttendanceRecords, 
  deleteAttendanceRecords 
} from "@/services/attendance-service";
import { combineEmployeeAndAttendanceData } from "@/utils/attendance-utils";

export function useAttendanceActions(
  modifiedRows: Set<string>,
  attendanceData: AttendanceRecord[],
  deletedRecords: Set<string>,
  selectedDate: Date,
  employees: Employee[] | undefined,
  setOriginalData: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>,
  setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>
) {
  // Save changes to the backend
  const saveChanges = useCallback(async () => {
    if (modifiedRows.size === 0) return;
    
    // Records to update or add (not marked for deletion)
    const recordsToUpdate = attendanceData
      .filter(record => modifiedRows.has(record.employee_id) && !record.markedForDeletion)
      .map(record => ({
        attendance_id: record.attendance_id || undefined,
        employee_id: record.employee_id,
        fullName: record.fullName,
        date: record.date,
        status: record.status,
        startTime: record.startTime,
        endTime: record.endTime,
        overtimeHours: record.overtimeHours,
        notes: record.notes,
      }));
    
    // Records to delete
    const recordsToDelete = Array.from(deletedRecords).map(id => ({
      attendance_id: id
    }));
    
    try {
      // Save updates and additions
      if (recordsToUpdate.length > 0) {
        await saveAttendanceRecords(recordsToUpdate);
      }
      
      // Delete marked records
      if (recordsToDelete.length > 0) {
        await deleteAttendanceRecords(recordsToDelete);
      }
      
      // Refresh data after all operations are complete
      const refreshedRecords = await fetchAttendanceRecords(selectedDate);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      if (employees) {
        const combinedData = combineEmployeeAndAttendanceData(
          employees,
          refreshedRecords,
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
      
      return true;
    } catch (error) {
      console.error("Error saving attendance:", error);
      throw error;
    }
  }, [
    modifiedRows, 
    attendanceData, 
    deletedRecords, 
    selectedDate, 
    employees, 
    setOriginalData, 
    setAttendanceData
  ]);

  return saveChanges;
}
