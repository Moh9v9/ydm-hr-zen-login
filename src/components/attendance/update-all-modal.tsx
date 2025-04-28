
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UpdateAllModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: {
    status: string;
    startTime?: string | null;
    endTime?: string | null;
    overtimeHours?: number | null;
    notes?: string | null;
  }) => void;
}

export function UpdateAllModal({ 
  open, 
  onOpenChange,
  onUpdate
}: UpdateAllModalProps) {
  const [status, setStatus] = useState("Present");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [overtimeHours, setOvertimeHours] = useState("");
  const [notes, setNotes] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData = {
      status,
      // Pass time values as plain strings
      startTime: startTime || null,
      endTime: endTime || null,
      overtimeHours: overtimeHours ? parseFloat(overtimeHours) : null,
      notes: notes || null,
    };
    
    onUpdate(updateData);
    onOpenChange(false);
    
    // Reset form
    setStartTime("");
    setEndTime("");
    setOvertimeHours("");
    setNotes("");
  };
  
  const handleStatusChange = (value: string) => {
    setStatus(value);
    
    // Clear other fields if status is Absent
    if (value === "Absent") {
      setStartTime("");
      setEndTime("");
      setOvertimeHours("");
      setNotes("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Bulk Update Attendance</DialogTitle>
            <DialogDescription>
              Apply these values to all filtered employees.
              Individual records can still be edited afterward.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {status === "Present" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      // Change to text type to accept any string format
                      type="text"
                      placeholder="e.g. 07:00 am"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      // Change to text type to accept any string format
                      type="text"
                      placeholder="e.g. 05:00 pm"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="overtimeHours">Overtime Hours</Label>
                  <Input
                    id="overtimeHours"
                    type="number"
                    min="0"
                    step="0.5"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes that will apply to all records"
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Apply to All</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
