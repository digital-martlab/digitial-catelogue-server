import { z } from "zod";

export const storeShema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email({ message: "Email must be valid" }),
    number: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^\d+$/, "Phone number must contain only numbers"),
    store_name: z.string().min(1, "Store name is required"),
    store_id: z.string(),
    password: z.string().optional()
});