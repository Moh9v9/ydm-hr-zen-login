import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, CalendarDays, Wallet, FileText, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
const navigationItems = [{
  title: "Dashboard",
  path: "/dashboard",
  icon: LayoutDashboard
}, {
  title: "Employees",
  path: "/employees",
  icon: Users
}, {
  title: "Attendance",
  path: "/attendance",
  icon: CalendarDays
}, {
  title: "Payroll",
  path: "/payroll",
  icon: Wallet
}, {
  title: "Leaves",
  path: "/leaves",
  icon: FileText
}, {
  title: "Users",
  path: "/users",
  icon: User
}];
export function MainSidebar() {
  const location = useLocation();
  const {
    isMobile,
    setOpen,
    setOpenMobile,
    state
  } = useSidebar();
  const [username] = useState("John Doe");

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "fixed top-4 z-40 lg:block transition-all duration-300", 
          state === "expanded" ? "left-[calc(var(--sidebar-width)_-_3rem)]" : "left-4"
        )} 
        asChild
      >
        <SidebarTrigger>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </SidebarTrigger>
      </Button>

      <Sidebar className="border-r bg-card">
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
                      "w-full whitespace-nowrap", 
                      location.pathname === item.path && "bg-primary text-primary-foreground"
                    )}
                  >
                    <item.icon className="shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4">
          
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
