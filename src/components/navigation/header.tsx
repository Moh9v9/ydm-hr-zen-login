
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserRound } from "lucide-react"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 flex items-center justify-end gap-4 p-4 bg-background border-b z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <UserRound className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          {user?.fullName || user?.email}
        </span>
      </div>
      <ThemeToggle />
    </header>
  )
}
