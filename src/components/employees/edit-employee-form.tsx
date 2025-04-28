
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { formSchema, type FormValues } from "./schema/employee-form-schema";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { LegalInfoSection } from "./form-sections/LegalInfoSection";
import { WorkInfoSection } from "./form-sections/WorkInfoSection";
import { CompensationSection } from "./form-sections/CompensationSection";
import { PermissionsSection } from "./form-sections/PermissionsSection";
import { useUpdateEmployee } from "@/hooks/use-update-employee";
import { isEqual } from "lodash";

interface EditEmployeeFormProps {
  employeeId: string;
  onClose: () => void;
}

export function EditEmployeeForm({ employeeId, onClose }: EditEmployeeFormProps) {
  const isMobile = useIsMobile();
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  
  const { fetchEmployee, updateEmployee, isSubmitting, isLoading, error, employee } = useUpdateEmployee({
    employeeId,
    onSuccess: onClose,
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      nationality: "",
      phoneNumber: "",
      email: "",
      iban: "",
      iqamaNumber: "",
      jobTitle: "",
      sponsorship: "",
      project: "",
      location: "",
      status: "Active",
      paymentType: "Monthly",
      rateOfPayment: "",
      attendanceRequired: false,
      comments: "",
    },
  });

  // Fetch employee data as soon as the component mounts
  useEffect(() => {
    if (employeeId) {
      fetchEmployee(employeeId);
    }
  }, [employeeId, fetchEmployee]);

  // Update form with employee data when it's loaded
  useEffect(() => {
    if (employee) {
      Object.entries(employee).forEach(([key, value]) => {
        form.setValue(key as keyof FormValues, value);
      });
      setInitialValues(employee);
      form.reset(employee); // Reset form with new values to clear any previous dirty state
    }
  }, [employee, form]);

  // Check if form is dirty (values have been modified)
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (initialValues) {
        const currentValues = value as FormValues;
        setIsDirty(!isEqual(currentValues, initialValues));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, initialValues]);

  const onSubmit = async (data: FormValues) => {
    await updateEmployee(data);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading employee data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {isMobile && (
        <div className="flex items-center mb-4 p-2">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <span className="sr-only">Back</span>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Edit Employee</h1>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive rounded-md p-4 mb-6">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <PersonalInfoSection form={form} />
          <LegalInfoSection form={form} />
          <WorkInfoSection form={form} />
          <CompensationSection form={form} />
          <PermissionsSection form={form} />

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !isDirty || !form.formState.isValid}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
