import { z } from 'zod';
import { emailValidation } from './common';

export const inviteMemberSchema = z.object({
  email: emailValidation,
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
