
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema/employee-form-schema";

interface PermissionsSectionProps {
  form: UseFormReturn<FormValues>;
}

export function PermissionsSection({ form }: PermissionsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Permissions</h2>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="attendanceRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Attendance Required</FormLabel>
                <FormDescription>
                  Should this employee track attendance?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional comments about the employee"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
