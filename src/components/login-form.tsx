
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { LoginError } from "./login/login-error";
import { LoginFields } from "./login/login-fields";
import { useLogin } from "@/hooks/use-login";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { handleLogin, loginError, isLoading } = useLogin();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    handleLogin(data);
  };

  return (
    <Form {...form}>
      <LoginError error={loginError} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <LoginFields form={form} isLoading={isLoading} />
      </form>
    </Form>
  );
}
