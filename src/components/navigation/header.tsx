
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserRound, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 flex items-center justify-between gap-4 p-4 bg-background border-b z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <img 
          src="https://i.ibb.co/DPfXmyDz/YDM-logo2-2.png" 
          alt="YDM HR Logo" 
          className="h-8 w-8" 
        />
        <span className="font-semibold text-lg text-foreground whitespace-nowrap">
          YDM HR
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {user?.fullName || user?.email}
          </span>
        </div>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="hover:bg-muted"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
