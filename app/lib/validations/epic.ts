import { z } from 'zod';

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const epicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  assigneeId: z.string().optional().or(z.literal('')),
  deadline: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => !value || value >= getTodayDateString(),
      'Deadline must be today or in the future'
    ),
});

export type EpicFormData = z.infer<typeof epicSchema>;
