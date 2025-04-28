
import { Employee } from "@/hooks/use-employees";
import { AttendanceRecord, RawAttendanceRecord, Filters } from "@/types/attendance";

export const combineEmployeeAndAttendanceData = (
  employees: Employee[],
  attendanceRecords: RawAttendanceRecord[],
  date: string
): AttendanceRecord[] => {
  const combinedData: AttendanceRecord[] = [];

  employees.forEach(emp => {
    const attendance = attendanceRecords.find(a => a.employee_id === emp.employee_id);
    const isActive = emp.status?.toLowerCase() === "active";
    
    combinedData.push({
      employee_id: emp.employee_id,
      fullName: emp.fullName,
      id_iqama_national: emp.id_iqama_national,
      jobTitle: emp.jobTitle || "",
      project: emp.project || "",
      location: emp.location || "",
      status: attendance ? attendance.status : "Absent",
      isActive,
      paymentType: emp.paymentType || "Monthly",
      sponsorship: emp.sponsorship || "",
      hasAttendanceRecord: !!attendance,
      startTime: attendance?.start_time || null,
      endTime: attendance?.end_time || null,
      overtimeHours: attendance?.overtime !== undefined ? attendance.overtime : null,
      notes: attendance?.note || null,
      date,
    });
  });
  
  // Handle attendance records for unknown employees
  attendanceRecords.forEach(record => {
    if (!combinedData.some(data => data.employee_id === record.employee_id)) {
      combinedData.push({
        employee_id: record.employee_id,
        fullName: "Unknown Employee",
        id_iqama_national: "",
        jobTitle: "",
        project: "",
        location: "",
        status: record.status,
        isActive: false,
        paymentType: "Monthly",
        sponsorship: "",
        hasAttendanceRecord: true,
        startTime: record.start_time || null,
        endTime: record.end_time || null,
        overtimeHours: record.overtime !== undefined ? record.overtime : null,
        notes: record.note || null,
        date,
      });
    }
  });

  return combinedData;
};

export const filterAttendanceData = (data: AttendanceRecord[], filters: Filters): AttendanceRecord[] => {
  return data.filter((record) => {
    return (
      (filters.project === "" || record.project === filters.project) &&
      (filters.location === "" || record.location === filters.location) &&
      (filters.paymentType === "" || record.paymentType === filters.paymentType) &&
      (filters.sponsorship === "" || record.sponsorship === filters.sponsorship)
    );
  });
};
