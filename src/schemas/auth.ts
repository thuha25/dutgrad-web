import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().nonempty("Password is required"),
});

export const mfaVerifySchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
  use_backup_code: z.boolean().optional().default(false),
});

export const mfaSetupSchema = z.object({});

export const mfaVerifyEnableSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

export const usernameUpdateSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
});

export const registerSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginCredentials = z.infer<typeof loginSchema>;
export type MFAVerifyCredentials = z.infer<typeof mfaVerifySchema>;
export type MFASetupCredentials = z.infer<typeof mfaSetupSchema>;
export type MFAVerifyEnableCredentials = z.infer<typeof mfaVerifyEnableSchema>;
export type UsernameUpdateCredentials = z.infer<typeof usernameUpdateSchema>;

export const stateParamSchema = z.string().min(1);

export const userSchema = z.object({
  id: z.string().or(z.number()),
  email: z.string().email(),
  username: z.string(),
  created_at: z.date(),
  mfa_enabled: z.boolean().optional(),
  auth_provider: z.string().optional(), 
});

export type User = z.infer<typeof userSchema>;

export const authResponseSchema = z.object({
  token: z.string(),
  refresh: z.string().optional(),
  user: userSchema.optional(),
  is_new_user: z.boolean().optional(),
  requires_mfa: z.boolean().optional(),
  temp_token: z.string().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
