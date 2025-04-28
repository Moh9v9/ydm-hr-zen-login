import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginFormValues } from "../login-form";

interface LoginFieldsProps {
  form: UseFormReturn<LoginFormValues>;
  isLoading: boolean;
}

export function LoginFields({ form, isLoading }: LoginFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
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
    </>
  );
}
