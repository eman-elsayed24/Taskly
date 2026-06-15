import { z } from 'zod';

export const epicSchema = z.object({
  title: z
    .string()
    .min(3, 'Title is required (minimum 3 characters)')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  assignee_id: z.string().optional().or(z.literal('')),
  deadline: z.string().optional().or(z.literal('')),
});

export type EpicFormData = z.infer<typeof epicSchema>;
