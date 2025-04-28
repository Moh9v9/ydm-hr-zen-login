
export function AttendanceTableSkeleton() {
  return (
    <div className="p-8 flex justify-center">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-72 bg-muted rounded"></div>
        <div className="h-24 w-full max-w-3xl bg-muted rounded"></div>
      </div>
    </div>
  );
}
