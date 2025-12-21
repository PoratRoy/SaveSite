import { z } from 'zod';

export const folderSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  userId: z.string(),
  parentId: z.string().nullable().optional(),
  createdAt: z.date().optional(),
});

export type FolderSchemaType = z.infer<typeof folderSchema>;
