
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { formSchema, type FormValues } from "./schema/employee-form-schema";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { LegalInfoSection } from "./form-sections/LegalInfoSection";
import { WorkInfoSection } from "./form-sections/WorkInfoSection";
import { CompensationSection } from "./form-sections/CompensationSection";
import { PermissionsSection } from "./form-sections/PermissionsSection";
import { useCreateEmployee } from "@/hooks/use-create-employee";

interface CreateEmployeeFormProps {
  onClose: () => void;
}

export function CreateEmployeeForm({ onClose }: CreateEmployeeFormProps) {
  const isMobile = useIsMobile();
  const { createEmployee, isSubmitting, error } = useCreateEmployee({
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

  const onSubmit = async (data: FormValues) => {
    await createEmployee(data);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {isMobile && (
        <div className="flex items-center mb-4 p-2">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <span className="sr-only">Back</span>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Create New Employee</h1>
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
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Create Employee
                </span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
