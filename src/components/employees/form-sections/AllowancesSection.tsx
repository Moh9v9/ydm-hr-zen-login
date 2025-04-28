
import { UseFormReturn } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { FormValues } from "../schema/employee-form-schema";

interface AllowancesSectionProps {
  form: UseFormReturn<FormValues>;
}

export function AllowancesSection({ form }: AllowancesSectionProps) {
  const watchLunchAllowance = form.watch("lunchAllowance");
  const watchJumaAllowance = form.watch("jumaAllowance");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Allowances</h2>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="overtimeEligible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Eligible for Overtime?</FormLabel>
                <FormDescription>
                  Can this employee claim overtime pay?
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
          name="lunchAllowance"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Lunch Allowance</FormLabel>
                <FormDescription>
                  Is this employee eligible for lunch allowance?
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

        {watchLunchAllowance && (
          <FormField
            control={form.control}
            name="lunchAllowanceAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lunch Allowance Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="jumaAllowance"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Juma Allowance</FormLabel>
                <FormDescription>
                  Is this employee eligible for Juma allowance?
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

        {watchJumaAllowance && (
          <FormField
            control={form.control}
            name="jumaAllowanceAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Juma Allowance Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="additionalMonthly"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Monthly Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter additional monthly amount"
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
