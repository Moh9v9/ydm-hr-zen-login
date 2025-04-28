
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { AppLayout } from "@/layouts/AppLayout"
import { LoadingScreen } from "@/components/LoadingScreen"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
import Attendance from "./pages/Attendance"
import ForgotPassword from "./pages/ForgotPassword"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes - All wrapped in AppLayout */}
              <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/employees" element={<AppLayout><Employees /></AppLayout>} />
              <Route path="/attendance" element={<AppLayout><Attendance /></AppLayout>} />
              <Route path="/payroll" element={<AppLayout><Navigate to="/dashboard" replace /></AppLayout>} />
              <Route path="/leaves" element={<AppLayout><Navigate to="/dashboard" replace /></AppLayout>} />
              <Route path="/users" element={<AppLayout><Navigate to="/dashboard" replace /></AppLayout>} />
              
              {/* 404 Route - Also wrapped in AppLayout if user is authenticated */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export default App
