import { z } from 'zod';

export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export type TagSchemaType = z.infer<typeof tagSchema>;
