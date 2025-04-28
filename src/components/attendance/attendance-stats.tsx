
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceStatsProps {
  totalEmployees: number;
  totalPresent: number;
  totalAbsent: number;
}

export function AttendanceStats({
  totalEmployees,
  totalPresent,
  totalAbsent,
}: AttendanceStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmployees}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-500">
            Present
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPresent}</div>
          <p className="text-xs text-muted-foreground">
            {totalEmployees > 0 ? Math.round(totalPresent / totalEmployees * 100) : 0}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-500">
            Absent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAbsent}</div>
          <p className="text-xs text-muted-foreground">
            {totalEmployees > 0 ? Math.round(totalAbsent / totalEmployees * 100) : 0}% of total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
