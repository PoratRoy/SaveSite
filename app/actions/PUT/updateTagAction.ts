"use server";

import { db } from "@/db";
import { Tag } from "@/models/types/tag";

interface UpdateTagInput {
  tagId: string;
  name: string;
}

/**
 * Update a tag's name
 */
export async function updateTagAction(input: UpdateTagInput): Promise<Tag> {
  try {
    // Validate input
    if (!input.tagId || !input.name || !input.name.trim()) {
      throw new Error("Tag ID and name are required");
    }

    // Check if tag exists
    const existingTag = await db.tag.findUnique({
      where: { id: input.tagId },
    });

    if (!existingTag) {
      throw new Error("Tag not found");
    }

    // Check if new name conflicts with another tag in the same scope
    const conflictingTag = await db.tag.findFirst({
      where: {
        name: input.name.trim(),
        userId: existingTag.userId,
        folderId: existingTag.folderId,
        id: { not: input.tagId },
      },
    });

    if (conflictingTag) {
      throw new Error("Tag name already exists in this scope");
    }

    // Update tag
    const tag = await db.tag.update({
      where: { id: input.tagId },
      data: {
        name: input.name.trim(),
      },
    });

    return tag;
  } catch (error) {
    console.error("Error updating tag:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update tag");
  }
}
