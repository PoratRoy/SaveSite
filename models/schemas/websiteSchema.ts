import { z } from 'zod';

export const websiteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  link: z.string().url("Must be a valid URL"),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  position: z.number().int().default(0),
  starred: z.boolean().default(false),
  ownerId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type WebsiteSchemaType = z.infer<typeof websiteSchema>;
