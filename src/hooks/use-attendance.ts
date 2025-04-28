import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useEmployees } from "./use-employees";
import { toast } from "sonner";

export interface AttendanceRecord {
  employee_id: string;
  fullName: string;
  id_iqama_national: string;
  jobTitle: string;
  project: string;
  location: string;
  status: string;
  isActive: boolean;
  paymentType: string;
  sponsorship: string;
  hasAttendanceRecord: boolean;
  startTime: string | null;
  endTime: string | null;
  overtimeHours: number | null;
  notes: string | null;
  date: string;
}

interface Filters {
  project: string;
  location: string;
  paymentType: string;
  sponsorship: string;
}

interface BulkUpdateData {
  status: string;
  startTime?: string | null;
  endTime?: string | null;
  overtimeHours?: number | null;
  notes?: string | null;
}

export const useAttendance = (selectedDate: Date, filters: Filters) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [originalData, setOriginalData] = useState<AttendanceRecord[]>([]);
  const [modifiedRows, setModifiedRows] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { data: employees, isLoading: isLoadingEmployees, error: employeesError } = useEmployees();
  
  // Format date as YYYY-MM-DD without timezone concerns
  const formatDateForAPI = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };
  
  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (isLoadingEmployees) return;
      if (employeesError) {
        setError(new Error("Failed to load employees data"));
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get formatted date string for API
        const formattedDate = formatDateForAPI(selectedDate);
        
        // Fetch attendance records for this date
        const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entity: "attendance",
            operation: "read",
            date: formattedDate, // Use the formatted date string
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch attendance: ${response.status}`);
        }
        
        const attendanceRecords = await response.json();
        
        // Map attendance records by employee_id for easier lookup
        const attendanceMap = new Map();
        attendanceRecords.forEach((record: any) => {
          attendanceMap.set(record.employee_id, record);
        });
        
        // Prepare data by combining employees with their attendance records
        const combinedData: AttendanceRecord[] = [];
        
        // First, add all active employees with or without attendance records
        if (employees) {
          employees.forEach((employee) => {
            const isActive = employee.status?.toLowerCase() === "active";
            const attendanceRecord = attendanceMap.get(employee.employee_id);
            const hasAttendanceRecord = !!attendanceRecord;
            
            // Add active employees or inactive employees with attendance records
            if (isActive || hasAttendanceRecord) {
              combinedData.push({
                employee_id: employee.employee_id,
                fullName: employee.fullName,
                id_iqama_national: employee.id_iqama_national,
                jobTitle: employee.jobTitle || "",
                project: employee.project || "",
                location: employee.location || "",
                status: hasAttendanceRecord ? attendanceRecord.status : "Absent",
                isActive,
                paymentType: employee.paymentType || "Monthly",
                sponsorship: employee.sponsorship || "",
                hasAttendanceRecord,
                startTime: hasAttendanceRecord ? attendanceRecord.startTime : null,
                endTime: hasAttendanceRecord ? attendanceRecord.endTime : null,
                overtimeHours: hasAttendanceRecord ? attendanceRecord.overtimeHours : null,
                notes: hasAttendanceRecord ? attendanceRecord.notes : null,
                date: formattedDate,
              });
              
              // Remove this record from the map as it's been processed
              if (hasAttendanceRecord) {
                attendanceMap.delete(employee.employee_id);
              }
            }
          });
        }
        
        // Copy data to set the original state for comparing changes
        setOriginalData([...combinedData]);
        setAttendanceData([...combinedData]);
        setModifiedRows(new Set());
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(err instanceof Error ? err : new Error("Failed to load attendance data"));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, [employees, isLoadingEmployees, employeesError, selectedDate]);
  
  // Filter the attendance data
  const filteredAttendanceData = useMemo(() => {
    return attendanceData.filter((record) => {
      return (
        (filters.project === "" || record.project === filters.project) &&
        (filters.location === "" || record.location === filters.location) &&
        (filters.paymentType === "" || record.paymentType === filters.paymentType) &&
        (filters.sponsorship === "" || record.sponsorship === filters.sponsorship)
      );
    });
  }, [attendanceData, filters]);
  
  // Update a field for a specific employee's attendance
  const updateAttendanceField = (employeeId: string, field: string, value: any) => {
    setAttendanceData((prevData) => {
      return prevData.map((record) => {
        if (record.employee_id === employeeId) {
          // If changing status to Absent, clear time-related fields
          const updatedRecord = { ...record, [field]: value };
          if (field === 'status' && value === 'Absent') {
            updatedRecord.startTime = null;
            updatedRecord.endTime = null;
            updatedRecord.overtimeHours = null;
          }
          
          // Mark this row as modified
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
        // Only update records that match current filter criteria
        const matchesFilter = 
          (filters.project === "" || record.project === filters.project) &&
          (filters.location === "" || record.location === filters.location) &&
          (filters.paymentType === "" || record.paymentType === filters.paymentType) &&
          (filters.sponsorship === "" || record.sponsorship === filters.sponsorship);
        
        if (matchesFilter) {
          // Prepare updates based on new status
          const newRecord = { ...record, ...updateData };
          
          // Clear time fields if new status is Absent
          if (updateData.status === 'Absent') {
            newRecord.startTime = null;
            newRecord.endTime = null;
            newRecord.overtimeHours = null;
            newRecord.notes = null;
          }
          
          // Mark this row as modified if any values changed
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
  
  // Save changes to the backend - only send modified records
  const saveChanges = async () => {
    if (modifiedRows.size === 0) return;
    
    const recordsToUpdate = attendanceData.filter((record) => 
      modifiedRows.has(record.employee_id)
    ).map((record) => ({
      employee_id: record.employee_id,
      date: record.date,
      status: record.status,
      startTime: record.startTime,
      endTime: record.endTime,
      overtimeHours: record.overtimeHours,
      notes: record.notes,
    }));
    
    try {
      const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entity: "attendance",
          operation: "update",
          data: recordsToUpdate,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save attendance: ${response.status}`);
      }
      
      // Update original data with the new values
      setOriginalData([...attendanceData]);
      // Clear modified rows set
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
