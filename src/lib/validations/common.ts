import { z } from 'zod';

// Shared email validation
export const emailValidation = z.string().email('Please enter a valid email');

// Shared password validation (used in Login, Signup, and Reset)
export const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one digit')
  .regex(/[!@#$%^&*]/, 'Password must contain at least one special character');

// Shared confirm password validation
export const confirmPasswordValidation = z
  .string()
  .min(1, 'Please confirm your password');

// Type for password confirmation validation
type PasswordMatchInput = {
  password: string;
  confirmPassword: string;
};

// Helper function for password confirmation
export const withPasswordConfirmation = <
  T extends z.ZodType<PasswordMatchInput>,
>(
  schema: T
) => {
  return schema.refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
};
