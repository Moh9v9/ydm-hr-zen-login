
import { format } from "date-fns";
import { RawAttendanceRecord } from "@/types/attendance";

const formatDateForAPI = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export const fetchAttendanceRecords = async (date: Date): Promise<RawAttendanceRecord[]> => {
  const formattedDate = formatDateForAPI(date);
  
  const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entity: "attendance",
      operation: "read",
      date: formattedDate,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch attendance: ${response.status}`);
  }

  return response.json();
};

export const saveAttendanceRecords = async (records: any[]) => {
  // Group records by whether they have an attendance_id
  const existingRecords = records.filter(record => record.attendance_id);
  const newRecords = records.filter(record => !record.attendance_id);
  
  const now = new Date().toISOString();
  
  // Process update operations if there are existing records
  if (existingRecords.length > 0) {
    const updatePayload = {
      entity: "attendance",
      operation: "update",
      data: existingRecords.map(record => ({
        attendance_id: record.attendance_id,
        employee_id: record.employee_id,
        fullName: record.fullName,
        date: record.date,
        status: record.status.toLowerCase(),
        start_time: record.status.toLowerCase() === "absent" ? null : record.startTime,
        end_time: record.status.toLowerCase() === "absent" ? null : record.endTime,
        overtime: record.status.toLowerCase() === "absent" ? null : record.overtimeHours,
        note: record.notes === "" ? null : record.notes,
        updated_at: now
      }))
    };
    
    const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update attendance: ${response.status}`);
    }
  }
  
  // Process add operations if there are new records
  if (newRecords.length > 0) {
    const addPayload = {
      entity: "attendance",
      operation: "add",
      data: newRecords.map(record => ({
        employee_id: record.employee_id,
        fullName: record.fullName,
        date: record.date,
        status: record.status.toLowerCase(),
        start_time: record.status.toLowerCase() === "absent" ? null : record.startTime,
        end_time: record.status.toLowerCase() === "absent" ? null : record.endTime,
        overtime: record.status.toLowerCase() === "absent" ? null : record.overtimeHours,
        note: record.notes === "" ? null : record.notes,
        created_at: now,
        updated_at: now
      }))
    };
    
    const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addPayload),
    });

    if (!response.ok) {
      throw new Error(`Failed to add attendance: ${response.status}`);
    }
  }
  
  return { success: true };
};

export const deleteAttendanceRecords = async (attendanceIds: string[]) => {
  const deletePayload = {
    entity: "attendance",
    operation: "delete",
    data: attendanceIds.map(id => ({
      attendance_id: id
    }))
  };
  
  const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deletePayload),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete attendance: ${response.status}`);
  }
  
  return { success: true };
};
