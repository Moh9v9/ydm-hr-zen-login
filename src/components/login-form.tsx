import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setLoginError(null);
    setIsLoading(true);
    
    try {
      const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entity: "users",
          operation: "login",
          email: data.email,
          password: data.password,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      
      if (result.error) {
        setLoginError(result.error);
        console.error("Login error:", result.error);
      } else {
        // Successful login
        if (data.rememberMe) {
          localStorage.setItem("ydm-user-session", JSON.stringify({
            email: data.email,
            timestamp: new Date().toISOString(),
            token: result.token // Store token if provided by the API
          }));
        }
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Login failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      {loginError && (
        <Alert variant="destructive" className="mb-6 animate-in">
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="email@ydmhr.com"
                    className="pl-10"
                    autoComplete="email"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10"
                    autoComplete="current-password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel 
                  htmlFor="rememberMe" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-ydm-accent hover:bg-ydm-secondary transition-all"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        
        <div className="text-sm">
          <a
            href="/forgot-password"
            className="text-ydm-secondary hover:text-ydm-accent transition-colors"
          >
            Forgot Password?
          </a>
        </div>
      </form>
    </Form>
  );
}
