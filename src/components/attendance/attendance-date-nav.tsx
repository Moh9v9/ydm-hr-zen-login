
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AttendanceDateNavProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export function AttendanceDateNav({
  selectedDate,
  onDateChange,
  onPreviousDay,
  onNextDay,
  onToday,
}: AttendanceDateNavProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onPreviousDay}
        title="Previous day"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous day</span>
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        onClick={onNextDay}
        title="Next day"
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next day</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onToday}
        title="Set to today"
      >
        <span className="sr-only">Today</span>
        <span className="text-xs">Today</span>
      </Button>
    </div>
  );
}
