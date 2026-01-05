"use server";

import { db } from "@/db";

interface DeleteTagInput {
  tagId: string;
}

/**
 * Delete a tag and remove it from all websites
 * Prisma automatically removes the join table entries for many-to-many relations
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
      include: { websites: true },
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    // Delete tag - Prisma automatically removes entries from the _WebsiteTags join table
    // This disconnects the tag from all websites without deleting the websites
    await db.tag.delete({
      where: { id: input.tagId },
    });
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete tag");
  }
}
