
import * as z from "zod";

export const formSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  nationality: z.string().optional(),
  phoneNumber: z.string().optional(),
  startDate: z.date().optional(),
  email: z.string().optional(),
  iban: z.string().optional(),
  iqamaNumber: z.string().optional(),
  iqamaExpiryDate: z.date().optional(),
  jobTitle: z.string().optional(),
  sponsorship: z.string().optional(),
  project: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  paymentType: z.enum(["Monthly", "Daily", "Hourly"]).default("Monthly"),
  rateOfPayment: z.string().optional(),
  attendanceRequired: z.boolean().default(false),
  comments: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
