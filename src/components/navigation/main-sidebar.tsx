
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger, 
  useSidebar 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, CalendarDays, Wallet, FileText, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Employees",
    path: "/employees",
    icon: Users
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: CalendarDays
  },
  {
    title: "Payroll",
    path: "/payroll",
    icon: Wallet
  },
  {
    title: "Leaves",
    path: "/leaves",
    icon: FileText
  },
  {
    title: "Users",
    path: "/users",
    icon: User
  }
];

export function MainSidebar() {
  const location = useLocation();
  const {
    isMobile,
    setOpenMobile,
    state
  } = useSidebar();
  const [username] = useState("John Doe");

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      {/* Sidebar toggle button - positioned outside the sidebar */}
      <div className={cn(
        "fixed left-0 top-20 z-20 transition-all duration-300",
        state === "expanded" ? "left-[220px]" : "left-[60px]"
      )}>
        <SidebarTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-background/80 backdrop-blur"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SidebarTrigger>
      </div>

      {/* Main sidebar component */}
      <Sidebar 
        className="border-r bg-card"
        style={{ 
          "--sidebar-width": "240px",
          "--sidebar-width-icon": "64px"
        } as React.CSSProperties}
      >
        <div className="flex h-16 items-center justify-center border-b">
          <span className="text-lg font-semibold text-primary">
            {state === "expanded" ? "YDM HR" : "YDM"}
          </span>
        </div>
        
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navigationItems.map(item => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={location.pathname === item.path} 
                  tooltip={item.title} 
                  onClick={handleNavigation}
                >
                  <Link 
                    to={item.path} 
                    className={cn(
                      "w-full whitespace-nowrap flex items-center gap-3", 
                      location.pathname === item.path && "bg-primary text-primary-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
