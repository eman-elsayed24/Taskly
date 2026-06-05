import { z } from 'zod';
import {
  passwordValidation,
  confirmPasswordValidation,
  withPasswordConfirmation,
} from './common';

export const resetPasswordSchema = withPasswordConfirmation(
  z.object({
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
  })
);

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
