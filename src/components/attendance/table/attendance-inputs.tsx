
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AttendanceInputsProps {
  employeeId: string;
  startTime: string | null;
  endTime: string | null;
  overtimeHours: number | null;
  notes: string | null;
  status: string;
  isActive: boolean;
  onTimeChange: (employeeId: string, field: string, value: string) => void;
  onOvertimeChange: (employeeId: string, value: string) => void;
  onNotesChange: (employeeId: string, value: string) => void;
}

export function AttendanceInputs({
  employeeId,
  startTime,
  endTime,
  overtimeHours,
  notes,
  status,
  isActive,
  onTimeChange,
  onOvertimeChange,
  onNotesChange,
}: AttendanceInputsProps) {
  const isDisabled = status.toLowerCase() !== "present" || !isActive;

  return (
    <>
      <Input
        type="text"
        placeholder="-- : --"
        value={startTime || ""}
        onChange={(e) => onTimeChange(employeeId, "startTime", e.target.value)}
        disabled={isDisabled}
      />
      <Input
        type="text"
        placeholder="-- : --"
        value={endTime || ""}
        onChange={(e) => onTimeChange(employeeId, "endTime", e.target.value)}
        disabled={isDisabled}
      />
      <Input
        type="number"
        min="0"
        step="0.5"
        value={overtimeHours !== null ? overtimeHours : ""}
        onChange={(e) => onOvertimeChange(employeeId, e.target.value)}
        disabled={isDisabled}
      />
      <Textarea
        value={notes || ""}
        onChange={(e) => onNotesChange(employeeId, e.target.value)}
        disabled={isDisabled}
        className="min-h-[50px] max-h-[100px]"
        placeholder="Add notes"
      />
    </>
  );
}
