
import { SidebarProvider } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/navigation/main-sidebar"
import { Header } from "@/components/navigation/header"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { LoadingScreen } from "@/components/LoadingScreen"
import { AlertCircle } from "lucide-react"

export interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("AppLayout rendering:", { isLoading, user: !!user, authChecked });

  useEffect(() => {
    // Check authentication status
    if (!isLoading) {
      if (!user) {
        console.log("No user detected, redirecting to login");
        navigate("/");
      } else {
        console.log("User authenticated:", user.email);
      }
      setAuthChecked(true);
    }
  }, [user, isLoading, navigate]);

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show error if there's an issue
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md p-6">
          <div className="bg-red-100 text-red-500 rounded-full p-3 mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            onClick={() => window.location.reload()}
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }

  // Don't render anything until auth is checked
  if (!authChecked) {
    return <LoadingScreen />;
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <MainSidebar />
        <div className="flex-1 flex flex-col h-screen overflow-auto">
          <Header />
          <div className="flex-1 p-4">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
