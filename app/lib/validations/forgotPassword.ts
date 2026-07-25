import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordSchema>;

export const RESEND_SECONDS = 5 * 60;
export const MAX_TRIALS = 3;
