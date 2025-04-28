
import { useState, useEffect, useMemo } from "react";
import { format, isFriday } from "date-fns";
import { useEmployees } from "./use-employees";
import { type AttendanceRecord, type Filters, type BulkUpdateData } from "@/types/attendance";
import { fetchAttendanceRecords, saveAttendanceRecords, deleteAttendanceRecords } from "@/services/attendance-service";
import { combineEmployeeAndAttendanceData, filterAttendanceData } from "@/utils/attendance-utils";

export function useAttendance(selectedDate: Date, filters: Filters) {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [originalData, setOriginalData] = useState<AttendanceRecord[]>([]);
  const [modifiedRows, setModifiedRows] = useState<Set<string>>(new Set());
  const [deletedRecords, setDeletedRecords] = useState<Set<string>>(new Set());
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
          setModifiedRows(new Set());
          setDeletedRecords(new Set());
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
    setAttendanceData(prevData => {
      return prevData.map(record => {
        if (record.employee_id === employeeId) {
          const updatedRecord = { ...record, [field]: value };
          
          // If status is set to "Absent", clear time-related fields
          if (field === 'status' && value.toLowerCase() === 'absent') {
            updatedRecord.startTime = null;
            updatedRecord.endTime = null;
            updatedRecord.overtimeHours = null;
          }
          
          // Check if this update actually changes the value
          const isChanged = JSON.stringify(record[field as keyof AttendanceRecord]) !== 
                            JSON.stringify(updatedRecord[field as keyof AttendanceRecord]);
          
          if (isChanged) {
            setModifiedRows(prev => {
              const next = new Set(prev);
              next.add(employeeId);
              return next;
            });
          }
          
          return updatedRecord;
        }
        return record;
      });
    });
  };
  
  // Mark a record for deletion
  const markRecordForDeletion = (employeeId: string, attendanceId?: string) => {
    if (!attendanceId) return;
    
    setAttendanceData(prevData => {
      return prevData.map(record => {
        if (record.employee_id === employeeId && record.attendance_id === attendanceId) {
          setModifiedRows(prev => {
            const next = new Set(prev);
            next.add(employeeId);
            return next;
          });
          
          setDeletedRecords(prev => {
            const next = new Set(prev);
            next.add(attendanceId);
            return next;
          });
          
          return {
            ...record,
            markedForDeletion: true
          };
        }
        return record;
      });
    });
  };
  
  // Apply bulk update to all or filtered employees
  const applyBulkUpdate = (updateData: BulkUpdateData) => {
    setAttendanceData(prevData => {
      return prevData.map(record => {
        // Only apply to filtered records and active employees
        if (
          record.isActive && 
          !record.markedForDeletion &&
          (filters.project === "" || record.project === filters.project) &&
          (filters.location === "" || record.location === filters.location) &&
          (filters.paymentType === "" || record.paymentType === filters.paymentType) &&
          (filters.sponsorship === "" || record.sponsorship === filters.sponsorship)
        ) {
          const newRecord = { ...record, ...updateData };
          
          // If setting to Absent, clear time fields
          if (updateData.status.toLowerCase() === 'absent') {
            newRecord.startTime = null;
            newRecord.endTime = null;
            newRecord.overtimeHours = null;
          }
          
          // Check if this update actually changes any values
          const hasChanged = Object.keys(updateData).some(
            key => JSON.stringify(record[key as keyof AttendanceRecord]) !== 
                  JSON.stringify(newRecord[key as keyof AttendanceRecord])
          );
          
          if (hasChanged) {
            setModifiedRows(prev => {
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
        setModifiedRows(new Set());
        setDeletedRecords(new Set());
      }
      
      return true;
    } catch (error) {
      console.error("Error saving attendance:", error);
      throw error;
    }
  };
  
  // Calculate summary statistics
  const totalEmployees = filteredAttendanceData.length;
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
