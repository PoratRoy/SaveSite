"use server";

import { db } from "@/db";

interface DeleteWebsiteInput {
  websiteId: string;
  userId: string;
}

/**
 * Delete a website
 */
export async function deleteWebsiteAction(input: DeleteWebsiteInput): Promise<void> {
  try {
    // Validate input
    if (!input.websiteId || !input.userId) {
      throw new Error("WebsiteId and userId are required");
    }

    // Verify website exists and belongs to the user
    const website = await db.website.findUnique({
      where: { id: input.websiteId },
    });

    if (!website) {
      throw new Error("Website not found");
    }

    if (website.ownerId !== input.userId) {
      throw new Error("Unauthorized: Website belongs to another user");
    }

    // Delete the website
    await db.website.delete({
      where: { id: input.websiteId },
    });
  } catch (error) {
    console.error("Error deleting website:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete website");
  }
}
