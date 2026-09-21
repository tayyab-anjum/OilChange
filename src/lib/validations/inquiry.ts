import { z } from "zod";

export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(255, { message: "Name is too long" }),
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
  businessName: z
    .string()
    .trim()
    .min(2, { message: "Restaurant/Business name must be at least 2 characters long" })
    .max(255, { message: "Business name is too long" }),
  subject: z
    .string()
    .trim()
    .min(3, { message: "Subject must be at least 3 characters long" })
    .max(255, { message: "Subject is too long" }),
  message: z
    .string()
    .trim()
    .min(15, { message: "Please enter at least 15 characters describing your kitchen requirements or questions" })
    .max(2000, { message: "Message cannot exceed 2000 characters" }),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
