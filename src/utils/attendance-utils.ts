
import { Employee } from "@/hooks/use-employees";
import { AttendanceRecord, RawAttendanceRecord, Filters } from "@/types/attendance";
import { isFriday } from "date-fns";

export const combineEmployeeAndAttendanceData = (
  employees: Employee[],
  attendanceRecords: RawAttendanceRecord[],
  date: string
): AttendanceRecord[] => {
  const combinedData: AttendanceRecord[] = [];
  const isSelectedDateFriday = isFriday(new Date(date));
  
  // Filter function for employees based on attendance requirement
  const shouldShowEmployee = (emp: Employee) => {
    // Since the Employee interface doesn't have attendance_required property,
    // let's check if it has the attendanceRequired property instead,
    // or fall back to checking if the employee should always be shown on Fridays
    return isSelectedDateFriday || emp.attendanceRequired !== false;
  };
  
  // First, process all active employees that meet the attendance requirement criteria
  employees
    .filter(emp => emp.status?.toLowerCase() === "active" && shouldShowEmployee(emp))
    .forEach(emp => {
      const attendance = attendanceRecords.find(a => a.employee_id === emp.employee_id);
      
      combinedData.push({
        employee_id: emp.employee_id,
        fullName: emp.fullName,
        id_iqama_national: emp.id_iqama_national,
        jobTitle: emp.jobTitle || "",
        project: emp.project || "",
        location: emp.location || "",
        status: attendance ? attendance.status : "Absent",
        isActive: true,
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
  
  // Then, add inactive employees who have attendance records AND meet the attendance requirement criteria
  employees
    .filter(emp => 
      emp.status?.toLowerCase() !== "active" && 
      shouldShowEmployee(emp)
    )
    .forEach(emp => {
      const attendance = attendanceRecords.find(a => a.employee_id === emp.employee_id);
      
      if (attendance) {
        combinedData.push({
          employee_id: emp.employee_id,
          fullName: emp.fullName,
          id_iqama_national: emp.id_iqama_national,
          jobTitle: emp.jobTitle || "",
          project: emp.project || "",
          location: emp.location || "",
          status: attendance.status,
          isActive: false,
          paymentType: emp.paymentType || "Monthly",
          sponsorship: emp.sponsorship || "",
          hasAttendanceRecord: true,
          startTime: attendance.start_time || null,
          endTime: attendance.end_time || null,
          overtimeHours: attendance.overtime !== undefined ? attendance.overtime : null,
          notes: attendance.note || null,
          date,
        });
      }
    });
  
  // Finally, add any attendance records for unknown employees (only on Fridays or if they have attendance_required)
  if (isSelectedDateFriday) {
    attendanceRecords
      .filter(record => !employees.some(emp => emp.employee_id === record.employee_id))
      .forEach(record => {
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
      });
  }

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
