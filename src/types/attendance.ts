
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
  attendance_id?: string;
  markedForDeletion?: boolean;
}

export interface RawAttendanceRecord {
  attendance_id: string;
  employee_id: string;
  date: string;
  status: string;
  start_time?: string;
  end_time?: string;
  overtime?: number;
  note?: string;
}

export interface Filters {
  project: string;
  location: string;
  paymentType: string;
  sponsorship: string;
}

export interface BulkUpdateData {
  status: string;
  startTime?: string | null;
  endTime?: string | null;
  overtimeHours?: number | null;
  notes?: string | null;
}
