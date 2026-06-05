import { z } from 'zod';
import { emailValidation } from './common';

export const forgotPasswordSchema = z.object({
  email: emailValidation,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
