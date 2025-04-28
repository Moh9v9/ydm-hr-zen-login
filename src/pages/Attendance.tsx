
import { useState, useMemo, useEffect } from "react";
import { addDays, subDays } from "date-fns";
import { useAttendance } from "@/hooks/use-attendance";
import { AttendanceHeader } from "@/components/attendance/attendance-header";
import { AttendanceStats } from "@/components/attendance/attendance-stats";
import { AttendanceFilters } from "@/components/attendance/attendance-filters";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { AttendanceDateNav } from "@/components/attendance/attendance-date-nav";
import { AttendanceActions } from "@/components/attendance/attendance-actions";
import { UpdateAllModal } from "@/components/attendance/update-all-modal";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Attendance() {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    project: "",
    location: "",
    paymentType: "",
    sponsorship: ""
  });
  const [isUpdateAllModalOpen, setIsUpdateAllModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    attendanceData,
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
    totalAbsent
  } = useAttendance(selectedDate, filters);

  useEffect(() => {
    if (error) {
      toast.error(t("common.status.error"), {
        description: error.message
      });
    }
  }, [error, t]);
  
  const handleSaveChanges = async () => {
    if (modifiedRows.size === 0 && deletedRecords.size === 0) {
      toast.info(t("common.status.noChanges"));
      return;
    }
    
    setIsSaving(true);
    try {
      await saveChanges();
      
      if (deletedRecords.size > 0) {
        toast.success(t("common.status.success"), {
          description: `${deletedRecords.size} ${t("attendance.actions.records")} ${t("common.actions.delete")}`
        });
      } else {
        toast.success(t("common.status.success"));
      }
    } catch (error) {
      toast.error(t("common.status.error"), {
        description: error instanceof Error ? error.message : t("common.status.unknownError")
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePreviousDay = () => setSelectedDate(prevDate => subDays(prevDate, 1));
  const handleNextDay = () => setSelectedDate(prevDate => addDays(prevDate, 1));
  const handleSetToday = () => setSelectedDate(new Date());

  return (
    <div className="flex flex-col gap-6 p-6">
      <AttendanceHeader selectedDate={selectedDate} />
      
      <AttendanceStats
        totalEmployees={totalEmployees}
        totalPresent={totalPresent}
        totalAbsent={totalAbsent}
      />

      <AttendanceFilters filters={filters} setFilters={setFilters} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <AttendanceDateNav
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
            onToday={handleSetToday}
          />
          
          <AttendanceActions
            modifiedCount={modifiedRows.size + deletedRecords.size}
            onUpdateAll={() => setIsUpdateAllModalOpen(true)}
            onSave={handleSaveChanges}
            isSaving={isSaving}
            isLoading={isLoading}
          />
        </div>

        <AttendanceTable
          attendanceData={attendanceData}
          updateAttendanceField={updateAttendanceField}
          markRecordForDeletion={markRecordForDeletion}
          isLoading={isLoading}
          modifiedRows={modifiedRows}
        />
      </div>

      <UpdateAllModal
        open={isUpdateAllModalOpen}
        onOpenChange={setIsUpdateAllModalOpen}
        onUpdate={applyBulkUpdate}
      />
    </div>
  );
}
