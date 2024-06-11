import { z } from 'zod';

export const userSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters.' })
    .max(255),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' })
    .max(255)
    .optional()
    .or(z.literal('')),
  role: z.string().optional(),
});
