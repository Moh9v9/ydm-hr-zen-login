
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
  const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entity: "attendance",
      operation: "update",
      data: records,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save attendance: ${response.status}`);
  }

  return response.json();
};
