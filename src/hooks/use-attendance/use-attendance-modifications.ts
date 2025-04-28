
import { useState, useCallback } from "react";
import { AttendanceRecord, BulkUpdateData, Filters } from "@/types/attendance";

export function useAttendanceModifications(
  attendanceData: AttendanceRecord[],
  setAttendanceData: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>
) {
  const [modifiedRows, setModifiedRows] = useState<Set<string>>(new Set());
  const [deletedRecords, setDeletedRecords] = useState<Set<string>>(new Set());

  // Update a field for a specific employee's attendance
  const updateAttendanceField = useCallback((employeeId: string, field: string, value: any) => {
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
  }, [setAttendanceData]);
  
  // Mark a record for deletion
  const markRecordForDeletion = useCallback(async (employeeId: string, attendanceId?: string): Promise<void> => {
    if (!attendanceId) return;
    
    return new Promise<void>((resolve) => {
      setAttendanceData(prevData => {
        const newData = prevData.map(record => {
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
        
        setTimeout(() => {
          resolve();
        }, 500); // Small delay to show the deleting state
        
        return newData;
      });
    });
  }, [setAttendanceData]);
  
  // Apply bulk update to all or filtered employees
  const applyBulkUpdate = useCallback((updateData: BulkUpdateData) => {
    setAttendanceData(prevData => {
      return prevData.map(record => {
        // Only apply to filtered records and active employees
        if (
          record.isActive && 
          !record.markedForDeletion
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
  }, [setAttendanceData]);

  return {
    modifiedRows,
    deletedRecords,
    updateAttendanceField,
    markRecordForDeletion,
    applyBulkUpdate,
  };
}
