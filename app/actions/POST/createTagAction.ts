"use server";

import { db } from "@/db";
import { Tag } from "@/models/types/tag";

interface CreateTagInput {
  name: string;
  userId?: string | null;
  folderId?: string | null;
}

/**
 * Create a new tag
 */
export async function createTagAction(input: CreateTagInput): Promise<Tag> {
  try {
    // Validate input
    if (!input.name || !input.name.trim()) {
      throw new Error("Tag name is required");
    }

    // Check if tag already exists in the same scope
    const existingTag = await db.tag.findFirst({
      where: {
        name: input.name.trim(),
        userId: input.userId || null,
        folderId: input.folderId || null,
      },
    });

    if (existingTag) {
      throw new Error("Tag already exists in this scope");
    }

    // Use transaction to shift existing tags and insert new one at position 0
    const tag = await db.$transaction(async (tx: any) => {
      // Get all existing tags in the same scope
      const existingTags = await tx.tag.findMany({
        where: {
          userId: input.userId || null,
          folderId: input.folderId || null,
        },
        select: { id: true, position: true },
      });

      // Increment position of all existing tags by 1
      if (existingTags.length > 0) {
        await Promise.all(
          existingTags.map((tag: any) =>
            tx.tag.update({
              where: { id: tag.id },
              data: { position: tag.position + 1 },
            })
          )
        );
      }

      // Create new tag at position 0
      const newTag = await tx.tag.create({
        data: {
          name: input.name.trim(),
          position: 0,
          userId: input.userId || null,
          folderId: input.folderId || null,
        },
      });

      return newTag;
    });

    return tag;
  } catch (error) {
    console.error("Error creating tag:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create tag");
  }
}
