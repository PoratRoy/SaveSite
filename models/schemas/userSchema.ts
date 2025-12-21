import { z } from 'zod';
// import { User } from '../types/user'; // Optional: Use if we want to strictly type the schema against the interface

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.string().default('user'),
  createdAt: z.date().optional(), // Optional because it might be a string in JSON or missing before creation
});

export type UserSchemaType = z.infer<typeof userSchema>;
