import { z } from 'zod';
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must be at most 50 characters')
      .regex(
        /^[\p{L}]+(?:\s[\p{L}]+)*$/u,
        'Name must contain letters only, no consecutive spaces or special characters'
      ),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email'),

    jobTitle: z.string().optional(),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be at most 64 characters')
      .regex(/^\S*$/, 'Password must not contain spaces')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one digit')
      .regex(
        /[!@#$%^&*]/,
        'Password must contain at least one special character'
      ),

    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email cannot be empty')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password cannot be empty'),
  rememberMe: z.boolean().default(false),
});

export type LoginSchema = z.infer<typeof loginSchema>;
