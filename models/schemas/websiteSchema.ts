import { z } from 'zod';

export const websiteSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  link: z.string().url(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  ownerId: z.string(),
  createdAt: z.date().optional(),
});

export type WebsiteSchemaType = z.infer<typeof websiteSchema>;
