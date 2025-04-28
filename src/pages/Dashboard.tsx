
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRound, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">YDM HR Dashboard</h1>
            <p className="text-muted-foreground">
              {user?.fullName ? `مرحباً ${user.fullName}` : "مرحباً بك في بوابة الموارد البشرية"}
            </p>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>الموظفين</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>إدارة بيانات الموظفين وسجلاتهم</CardDescription>
              <div className="mt-4">
                <Button asChild size="sm" className="mt-2">
                  <Link to="/employees">عرض الموظفين</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>الحضور</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>متابعة سجلات الحضور والانصراف</CardDescription>
              <div className="mt-4">
                <Button asChild size="sm" className="mt-2">
                  <Link to="/attendance">عرض الحضور</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <UserRound className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>المستخدمين</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>إدارة مستخدمي النظام والصلاحيات</CardDescription>
              <div className="mt-4">
                <Button asChild size="sm" className="mt-2">
                  <Link to="/users">إدارة المستخدمين</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
