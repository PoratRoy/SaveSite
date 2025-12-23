import { z } from 'zod';

export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  position: z.number().int().default(0),
});

export type TagSchemaType = z.infer<typeof tagSchema>;
