import { z } from 'zod';
import { TaskStatus } from '../../types/task';

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title is required (minimum 3 characters)')
    .max(200, 'Title must not exceed 200 characters'),
  status: z.nativeEnum(TaskStatus),
  assignee_id: z.string().optional().or(z.literal('')),
  epic_id: z.string().optional().or(z.literal('')),
  due_date: z.string().optional().or(z.literal('')),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
});

export type TaskFormData = z.infer<typeof taskSchema>;
