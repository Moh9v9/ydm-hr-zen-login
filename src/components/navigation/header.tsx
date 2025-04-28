
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserRound, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 flex items-center justify-end gap-4 p-4 bg-background border-b z-10 shadow-sm">
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
    </header>
  )
}
