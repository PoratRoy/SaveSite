import { z } from 'zod';

export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  position: z.number().int().default(0),
  
  // Tag scope: either user-level (global) or folder-specific
  userId: z.string().uuid().nullable().optional(),
  folderId: z.string().uuid().nullable().optional(),
});

export type TagSchemaType = z.infer<typeof tagSchema>;
