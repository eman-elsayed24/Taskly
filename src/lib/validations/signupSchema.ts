import { z } from 'zod';
import {
  emailValidation,
  passwordValidation,
  confirmPasswordValidation,
  withPasswordConfirmation,
} from './common';

export const signupSchema = withPasswordConfirmation(
  z.object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters'),
    email: emailValidation,
    jobTitle: z.string().optional(),
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
  })
);

export type SignupFormData = z.infer<typeof signupSchema>;
