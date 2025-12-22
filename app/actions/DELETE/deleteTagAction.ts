"use server";

import { db } from "@/db";

interface DeleteTagInput {
  tagId: string;
}

/**
 * Delete a tag
 * This will automatically disconnect all websites from this tag due to the relation
 */
export async function deleteTagAction(input: DeleteTagInput): Promise<void> {
  try {
    // Validate input
    if (!input.tagId) {
      throw new Error("Tag ID is required");
    }

    // Check if tag exists
    const tag = await db.tag.findUnique({
      where: { id: input.tagId },
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    // Delete tag (Prisma will handle disconnecting websites)
    await db.tag.delete({
      where: { id: input.tagId },
    });
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete tag");
  }
}
