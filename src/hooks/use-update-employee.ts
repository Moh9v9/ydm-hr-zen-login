
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
          operation: "read",
          employee_id: id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to fetch employee data");
      }

      const employeeData = await response.json();
      
      // Handle both single employee object and array responses
      const data = Array.isArray(employeeData) ? employeeData.find(emp => emp.employee_id === id) : employeeData;
      
      if (!data) {
        throw new Error("Employee not found");
      }
      
      // Convert API response to form values format with new allowance fields
      const formData: FormValues = {
        fullName: data.fullName || "",
        nationality: data.nationality || "",
        phoneNumber: data.phone?.toString() || "",
        email: data.email || "",
        iban: data.iban_bank || "",
        startDate: data.start_date ? new Date(data.start_date) : undefined,
        iqamaNumber: data.id_iqama_national?.toString() || "",
        iqamaExpiryDate: data.iqama_expiry_date ? new Date(data.iqama_expiry_date) : undefined,
        jobTitle: data.jobTitle || "",
        sponsorship: data.sponsorship || "",
        project: data.project || "",
        location: data.location || "",
        status: (data.status === "active" || data.status === "Active") ? "Active" : "Inactive",
        paymentType: data.paymentType || "Monthly",
        rateOfPayment: data.rateOfPayment?.toString() || "",
        attendanceRequired: data.attendance_required || false,
        overtimeEligible: data.overtime_eligible || false,
        lunchAllowance: data.lunch_allowance || false,
        lunchAllowanceAmount: data.lunch_allowance_amount?.toString() || "",
        jumaAllowance: data.juma_allowance || false,
        jumaAllowanceAmount: data.juma_allowance_amount?.toString() || "",
        additionalMonthly: data.additional_monthly?.toString() || "",
        comments: data.comments || "",
      };

      setEmployee(formData);
    } catch (err) {
      console.error("Error fetching employee:", err);
      setError(err instanceof Error ? err.message : "Failed to load employee data");
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
          data: {
            ...data,
            employee_id: employeeId, // Include employee_id in the update data
          },
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
