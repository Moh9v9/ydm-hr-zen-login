
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type FormValues } from "@/components/employees/schema/employee-form-schema";

interface UseCreateEmployeeProps {
  onSuccess?: () => void;
}

export function useCreateEmployee({ onSuccess }: UseCreateEmployeeProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const createEmployee = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entity: "employees",
          operation: "add",
          data: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create employee");
      }

      toast.success("Employee created successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSuccess?.();
    } catch (err) {
      console.error("Error creating employee:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createEmployee,
    isSubmitting,
    error,
  };
}
