
import { useAuth } from "@/contexts/AuthContext"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 flex items-center justify-end gap-4 p-4 bg-background border-b">
      <span className="text-sm font-medium">{user?.email}</span>
      <ThemeToggle />
    </header>
  )
}
