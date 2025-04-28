
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema/employee-form-schema";

interface CompensationSectionProps {
  form: UseFormReturn<FormValues>;
}

export function CompensationSection({ form }: CompensationSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Compensation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rateOfPayment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate of Payment (SAR)</FormLabel>
              <FormControl>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="number" 
                    placeholder="Enter payment rate" 
                    className="pl-9" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
