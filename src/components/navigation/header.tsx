
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="fixed top-0 right-0 z-50 flex items-center gap-4 p-4">
      <span className="text-sm font-medium">{user?.email}</span>
      <ThemeToggle />
    </header>
  )
}
