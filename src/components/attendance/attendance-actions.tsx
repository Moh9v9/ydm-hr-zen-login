
import { Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AttendanceActionsProps {
  modifiedCount: number;
  onUpdateAll: () => void;
  onSave: () => void;
  isSaving: boolean;
  isLoading: boolean;
}

export function AttendanceActions({
  modifiedCount,
  onUpdateAll,
  onSave,
  isSaving,
  isLoading,
}: AttendanceActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {modifiedCount > 0 && (
        <Badge
          variant="outline"
          className="bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:text-yellow-400 dark:border-yellow-900"
        >
          {modifiedCount} {modifiedCount === 1 ? 'change' : 'changes'} pending
        </Badge>
      )}
      
      <Button variant="outline" onClick={onUpdateAll} disabled={isLoading}>
        Update All
      </Button>
      
      <Button onClick={onSave} disabled={modifiedCount === 0 || isSaving}>
        {isSaving ? (
          "Saving..."
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
}
