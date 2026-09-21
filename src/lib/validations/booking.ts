import { z } from "zod";

export const bookingSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, { message: "Restaurant/Business name must be at least 2 characters" })
    .max(255, { message: "Business name cannot exceed 255 characters" }),
  contactName: z
    .string()
    .trim()
    .min(2, { message: "Contact person name must be at least 2 characters" })
    .max(255, { message: "Contact name cannot exceed 255 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid commercial or manager email address" })
    .max(255),
  phone: z
    .string()
    .trim()
    .min(7, { message: "Phone number must contain at least 7 digits" })
    .max(50, { message: "Phone number is too long" })
    .regex(/^[0-9+()\-\s.]+$/, { message: "Phone number contains invalid characters" }),
  address: z
    .string()
    .trim()
    .min(5, { message: "Please enter the complete kitchen street address" })
    .max(500, { message: "Address cannot exceed 500 characters" }),
  venueType: z.enum(["restaurant", "cafe", "fast_food", "food_truck"], {
    errorMap: () => ({ message: "Please select a valid venue type" }),
  }),
  fryerCount: z
    .number({ invalid_type_error: "Fryer count must be a number" })
    .int()
    .min(1, { message: "At least 1 fryer vat must be selected" })
    .max(20, { message: "For over 20 fryer vats, please contact fleet dispatch directly" }),
  frequency: z.enum(["weekly", "biweekly", "monthly", "one_time"], {
    errorMap: () => ({ message: "Please select a service frequency option" }),
  }),
  selectedAddonIds: z.array(z.string()).default([]),
  preferredDay: z.string().optional().default("monday"),
  preferredTimeWindow: z.string().optional().default("morning_pre_open"),
  specialInstructions: z.string().max(1000).optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
