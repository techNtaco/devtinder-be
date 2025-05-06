import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string()
    .min(6, "Username must be at least 6 characters"),

  email: z.string()
    .email("Invalid email")
    .transform((val) => val.toLowerCase()),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),

  firstName: z.string()
    .min(1, "First name is required"),

  lastName: z.string()
    .min(1, "Last name is required"),

  age: z.number()
    .int()
    .min(18, "Age must be at least 18"),

  gender: z.enum(["male", "female"], {
    required_error: "Gender is required"
  }),
  
  about: z.string().max(500, "About must be under 500 characters").optional(),

  skills: z
    .array(
      z.string()
        .min(1, "Skill cannot be empty")
        .transform((val) => val.toLowerCase())
    )
    .max(5, "You can only list up to 5 skills")
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Skills must be unique",
    })
    .optional(),

  photoUrl: z.string().optional()
});
