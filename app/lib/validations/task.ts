import { z } from 'zod';

export const TASK_STATUSES = [
  'TO_DO',
  'IN_PROGRESS',
  'BLOCKED',
  'IN_REVIEW',
  'READY_FOR_QA',
  'REOPENED',
  'READY_FOR_PRODUCTION',
  'DONE',
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const taskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
  epicId: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(TASK_STATUSES),
});

export type TaskFormData = z.infer<typeof taskSchema>;
