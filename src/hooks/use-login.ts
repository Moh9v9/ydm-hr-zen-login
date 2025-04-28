
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function useLogin() {
  const { toast } = useToast();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginData) => {
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
        login(
          {
            email: data.email,
            token: result.token,
            fullName: result.fullName // Include fullName from the response
          },
          data.rememberMe
        );
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Login failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    loginError,
    isLoading,
  };
}
