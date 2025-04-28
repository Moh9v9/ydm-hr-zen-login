
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Login = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8 animate-in">
        <div className="flex justify-center">
          <img 
            src="https://i.ibb.co/DPfXmyDz/YDM-logo2-2.png" 
            alt="YDM HR Logo" 
            className="h-16 md:h-20 object-contain" 
          />
        </div>
        
        <Card className="w-full shadow-lg border-opacity-50">
          <CardHeader className="pb-2">
            <h1 className="text-2xl font-semibold text-center">Welcome Back</h1>
            <p className="text-sm text-center text-muted-foreground">
              Log in to access your YDM HR portal
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
      
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} YDM HR. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
