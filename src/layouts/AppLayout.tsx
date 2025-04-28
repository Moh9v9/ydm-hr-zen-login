
import { SidebarProvider } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/navigation/main-sidebar"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { LoadingScreen } from "@/components/LoadingScreen"

export interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <MainSidebar />
        <main className="flex-1 h-screen overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
