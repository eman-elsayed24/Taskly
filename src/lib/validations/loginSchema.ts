import { z } from 'zod';
import { emailValidation, passwordValidation } from './common';

export const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
