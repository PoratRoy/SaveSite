"use server";

import { db } from "@/db";
import { Tag } from "@/models/types/tag";

/**
 * Get all tags (global tags, not user-specific based on schema)
 */
export async function getTagsAction(): Promise<Tag[]> {
  try {
    const tags = await db.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Failed to fetch tags");
  }
}
