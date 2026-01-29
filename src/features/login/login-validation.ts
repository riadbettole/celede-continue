import { z } from "zod";

export const EmailSchema = z
  .email("Please enter a valid email address");

export const PasswordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type Login = z.infer<typeof LoginSchema>;

export const personalInfoSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[!@#$%^&*]/, "Password must include at least one special character (!@#$%^&*)"),
});