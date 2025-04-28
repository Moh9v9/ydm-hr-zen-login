
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type FormValues } from "@/components/employees/schema/employee-form-schema";

interface UseUpdateEmployeeProps {
  employeeId?: string;
  onSuccess?: () => void;
}

export function useUpdateEmployee({ employeeId, onSuccess }: UseUpdateEmployeeProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employee, setEmployee] = useState<FormValues | null>(null);
  const queryClient = useQueryClient();

  const fetchEmployee = async (id: string) => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://n8n.moh9v9.com/webhook/google-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entity: "employees",
          operation: "get",
          id: id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to fetch employee");
      }

      const employeeData = await response.json();
      
      // Convert API response to form values format
      const formData: FormValues = {
        fullName: employeeData.fullName || "",
        nationality: employeeData.nationality || "",
        phoneNumber: employeeData.phone?.toString() || "",
        email: employeeData.email || "",
        iban: employeeData.iban_bank || "",
        startDate: employeeData.start_date ? new Date(employeeData.start_date) : undefined,
        iqamaNumber: employeeData.id_iqama_national?.toString() || "",
        iqamaExpiryDate: employeeData.iqama_expiry_date ? new Date(employeeData.iqama_expiry_date) : undefined,
        jobTitle: employeeData.jobTitle || "",
        sponsorship: employeeData.sponsorship || "",
        project: employeeData.project || "",
        location: employeeData.location || "",
        status: (employeeData.status === "active" || employeeData.status === "Active") ? "Active" : "Inactive",
        paymentType: employeeData.paymentType || "Monthly",
        rateOfPayment: employeeData.rateOfPayment?.toString() || "",
        attendanceRequired: employeeData.attendance_required || false,
        comments: employeeData.comments || "",
      };

      setEmployee(formData);
    } catch (err) {
      console.error("Error fetching employee:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast.error("Failed to load employee data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployee = async (data: FormValues) => {
    if (!employeeId) {
      toast.error("No employee ID provided");
      return;
    }
    
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
          operation: "update",
          id: employeeId,
          data: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update employee");
      }

      toast.success("Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSuccess?.();
    } catch (err) {
      console.error("Error updating employee:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast.error("Failed to update employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fetchEmployee,
    updateEmployee,
    isSubmitting,
    isLoading,
    error,
    employee,
  };
}
