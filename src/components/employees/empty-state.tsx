
import { Users } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-lg">
      <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
      <h3 className="mt-4 text-lg font-medium">No employees found</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
        No employees match your current filters. Try changing your search or filter criteria.
      </p>
    </div>
  );
}
