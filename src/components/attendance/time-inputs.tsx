
import { Input } from "@/components/ui/input";

interface TimeInputsProps {
  startTime: string | null;
  endTime: string | null;
  overtimeHours: number | null;
  isEditable: boolean;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onOvertimeChange: (value: string) => void;
}

export function TimeInputs({
  startTime,
  endTime,
  overtimeHours,
  isEditable,
  onStartTimeChange,
  onEndTimeChange,
  onOvertimeChange,
}: TimeInputsProps) {
  return (
    <>
      <Input 
        type="text" 
        placeholder="-- : --" 
        value={startTime || ""} 
        onChange={e => onStartTimeChange(e.target.value)}
        disabled={!isEditable} 
      />
      <Input 
        type="text" 
        placeholder="-- : --" 
        value={endTime || ""} 
        onChange={e => onEndTimeChange(e.target.value)}
        disabled={!isEditable} 
      />
      <Input 
        type="number" 
        min="0" 
        step="0.5" 
        value={overtimeHours !== null ? overtimeHours : ""}
        onChange={e => onOvertimeChange(e.target.value)}
        disabled={!isEditable} 
      />
    </>
  );
}
