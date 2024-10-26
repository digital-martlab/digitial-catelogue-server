import { z } from "zod";

export const userDetailsSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z
        .string()
        .min(10, "Phone must be at least 10 digits")
        .max(15, "Phone number cannot exceed 15 digits")
        .regex(/^\d+$/, "Phone must contain only numbers"),
    pincode: z.string().min(6, "Pincode must be 6 digits"),
    address: z.string().min(1, "Address is required"),
});