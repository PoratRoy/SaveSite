"use server";

import { db } from "@/db";
import { Tag } from "@/models/types/tag";

interface GetTagsInput {
  userId?: string;
  folderId?: string;
  scope?: 'global' | 'folder' | 'all';
}

/**
 * Get tags based on scope:
 * - global: user-level tags (userId set, folderId null)
 * - folder: folder-specific tags (folderId set)
 * - all: both global and folder tags for a specific context
 */
export async function getTagsAction(input?: GetTagsInput): Promise<Tag[]> {
  try {
    // If no input, return all tags (backward compatibility)
    if (!input) {
      const tags = await db.tag.findMany({
        orderBy: {
          position: "asc",
        },
      });
      return tags;
    }

    const { userId, folderId, scope = 'all' } = input;

    // Build where clause based on scope
    let whereClause: any = {};

    if (scope === 'global' && userId) {
      // Get only global tags for this user
      whereClause = {
        userId: userId,
        folderId: null,
      };
    } else if (scope === 'folder' && folderId) {
      // Get only folder-specific tags
      whereClause = {
        folderId: folderId,
      };
    } else if (scope === 'all') {
      // Get both global and folder-specific tags
      const conditions: any[] = [];
      
      if (userId) {
        conditions.push({ userId: userId, folderId: null });
      }
      
      if (folderId) {
        conditions.push({ folderId: folderId });
      }
      
      if (conditions.length > 0) {
        whereClause = { OR: conditions };
      }
    }

    const tags = await db.tag.findMany({
      where: whereClause,
      orderBy: {
        position: "asc",
      },
    });

    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Failed to fetch tags");
  }
}
