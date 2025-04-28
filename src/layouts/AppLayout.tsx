
import { SidebarProvider } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/navigation/main-sidebar"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate()

  // Basic auth check - redirect to login if no session exists
  useEffect(() => {
    if (!localStorage.getItem("ydm-user-session")) {
      navigate("/")
    }
  }, [navigate])

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full">
        <MainSidebar />
        <main className="flex-1 h-screen overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
