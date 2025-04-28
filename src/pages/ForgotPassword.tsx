
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

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
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: ForgotPasswordFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      console.log("Password reset requested for:", data.email);
    }, 1500);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-6 animate-in">
        <div className="flex justify-center">
          <Link to="/">
            <img 
              src="https://i.ibb.co/DPfXmyDz/YDM-logo2-2.png" 
              alt="YDM HR Logo" 
              className="h-16 md:h-20 object-contain" 
            />
          </Link>
        </div>
        
        <Card className="w-full shadow-lg border-opacity-50">
          <CardHeader className="pb-2">
            <h1 className="text-2xl font-semibold text-center">Forgot Password</h1>
            <p className="text-sm text-center text-muted-foreground">
              Enter your email to reset your password
            </p>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full dark:bg-green-900">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to your email address.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <Form {...form}>
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
                  
                  <div className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full bg-ydm-accent hover:bg-ydm-secondary transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Reset Password"}
                    </Button>
                    
                    <div className="text-center">
                      <Button asChild variant="link" size="sm">
                        <Link to="/">Back to Login</Link>
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
