
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginFormValues } from "../login-form";
import { EmailField } from "./email-field";
import { PasswordField } from "./password-field";

interface LoginFieldsProps {
  form: UseFormReturn<LoginFormValues>;
  isLoading: boolean;
}

export function LoginFields({ form, isLoading }: LoginFieldsProps) {
  return (
    <>
      <EmailField form={form} />
      <PasswordField form={form} />
      
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
