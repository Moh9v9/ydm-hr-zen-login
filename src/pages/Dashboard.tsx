
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">YDM HR Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your HR portal</p>
          </div>
          
          <Button
            variant="outline"
            onClick={logout}
          >
            Logout
          </Button>
        </header>
        
        <div className="p-8 border rounded-lg bg-card text-card-foreground">
          <p>Dashboard content would go here. This is a placeholder.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
