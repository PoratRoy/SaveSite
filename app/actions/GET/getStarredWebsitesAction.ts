"use server";

import { db } from "@/db";
import { Website } from "@/models/types/website";

interface GetStarredWebsitesInput {
  userId: string;
}

/**
 * Get all starred websites for a user
 */
export async function getStarredWebsitesAction(input: GetStarredWebsitesInput): Promise<Website[]> {
  try {
    if (!input.userId) {
      throw new Error("UserId is required");
    }

    const websites = await db.website.findMany({
      where: {
        ownerId: input.userId,
        starred: true,
      },
      include: {
        folders: true,
        tags: true,
      },
      orderBy: {
        position: 'asc',
      },
    });

    return websites;
  } catch (error) {
    console.error("Error fetching starred websites:", error);
    throw new Error("Failed to fetch starred websites");
  }
}
