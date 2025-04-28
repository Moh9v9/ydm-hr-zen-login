
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useEmployees } from "./use-employees";
import { AttendanceRecord, Filters, BulkUpdateData } from "@/types/attendance";
import { fetchAttendanceRecords, saveAttendanceRecords } from "@/services/attendance-service";
import { combineEmployeeAndAttendanceData, filterAttendanceData } from "@/utils/attendance-utils";

export const useAttendance = (selectedDate: Date, filters: Filters) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [originalData, setOriginalData] = useState<AttendanceRecord[]>([]);
  const [modifiedRows, setModifiedRows] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { data: employees, isLoading: isLoadingEmployees, error: employeesError } = useEmployees();
  
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
          const combinedData = combineEmployeeAndAttendanceData(
            employees,
            attendanceRecords,
            formattedDate
          );
          
          setOriginalData([...combinedData]);
          setAttendanceData([...combinedData]);
          setModifiedRows(new Set());
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
  
  // Update a field for a specific employee's attendance
  const updateAttendanceField = (employeeId: string, field: string, value: any) => {
    setAttendanceData((prevData) => {
      return prevData.map((record) => {
        if (record.employee_id === employeeId) {
          const updatedRecord = { ...record, [field]: value };
          if (field === 'status' && value === 'Absent') {
            updatedRecord.startTime = null;
            updatedRecord.endTime = null;
            updatedRecord.overtimeHours = null;
          }
          
          setModifiedRows((prev) => {
            const next = new Set(prev);
            next.add(employeeId);
            return next;
          });
          
          return updatedRecord;
        }
        return record;
      });
    });
  };
  
  // Apply bulk update to all or filtered employees
  const applyBulkUpdate = (updateData: BulkUpdateData) => {
    setAttendanceData((prevData) => {
      return prevData.map((record) => {
        if (filterAttendanceData([record], filters).length > 0) {
          const newRecord = { ...record, ...updateData };
          
          if (updateData.status === 'Absent') {
            newRecord.startTime = null;
            newRecord.endTime = null;
            newRecord.overtimeHours = null;
            newRecord.notes = null;
          }
          
          const hasChanged = Object.keys(updateData).some(
            (key) => record[key as keyof AttendanceRecord] !== newRecord[key as keyof AttendanceRecord]
          );
          
          if (hasChanged) {
            setModifiedRows((prev) => {
              const next = new Set(prev);
              next.add(record.employee_id);
              return next;
            });
          }
          
          return newRecord;
        }
        return record;
      });
    });
  };
  
  // Save changes to the backend
  const saveChanges = async () => {
    if (modifiedRows.size === 0) return;
    
    const recordsToUpdate = attendanceData
      .filter((record) => modifiedRows.has(record.employee_id))
      .map((record) => ({
        employee_id: record.employee_id,
        date: record.date,
        status: record.status,
        startTime: record.startTime,
        endTime: record.endTime,
        overtimeHours: record.overtimeHours,
        notes: record.notes,
      }));
    
    try {
      await saveAttendanceRecords(recordsToUpdate);
      setOriginalData([...attendanceData]);
      setModifiedRows(new Set());
      return true;
    } catch (error) {
      console.error("Error saving attendance:", error);
      throw error;
    }
  };
  
  // Calculate summary statistics
  const totalEmployees = filteredAttendanceData.length;
  const totalPresent = filteredAttendanceData.filter(
    (record) => record.status === "Present"
  ).length;
  const totalAbsent = totalEmployees - totalPresent;
  
  return {
    attendanceData: filteredAttendanceData,
    modifiedRows,
    isLoading,
    error,
    updateAttendanceField,
    applyBulkUpdate,
    saveChanges,
    totalEmployees,
    totalPresent,
    totalAbsent,
  };
};

// Re-export the type for convenience
export type { AttendanceRecord };
