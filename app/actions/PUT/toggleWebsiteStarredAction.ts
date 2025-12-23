"use server";

import { db } from "@/db";

interface ToggleWebsiteStarredInput {
  websiteId: string;
  userId: string;
  starred: boolean;
}

/**
 * Toggle starred status for a website
 */
export async function toggleWebsiteStarredAction(input: ToggleWebsiteStarredInput): Promise<void> {
  try {
    // Validate input
    if (!input.websiteId || !input.userId) {
      throw new Error("WebsiteId and userId are required");
    }

    // Verify website exists and belongs to the user
    const website = await db.website.findUnique({
      where: { id: input.websiteId },
      select: { id: true, ownerId: true },
    });

    if (!website) {
      throw new Error("Website not found");
    }

    if (website.ownerId !== input.userId) {
      throw new Error("Unauthorized: Website belongs to another user");
    }

    // Update starred status
    await db.website.update({
      where: { id: input.websiteId },
      data: { starred: input.starred },
    });
  } catch (error) {
    console.error("Error toggling website starred status:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to toggle starred status");
  }
}
