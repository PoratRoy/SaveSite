"use server";

import { db } from "@/db";
import { websiteSchema } from "@/models/schemas/websiteSchema";
import { Website } from "@/models/types/website";

interface CreateWebsiteInput {
  title: string;
  link: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  color?: string | null;
  ownerId: string;
  folderId: string;
  tagIds?: string[];
}

/**
 * Create a new website and add it to a folder
 */
export async function createWebsiteAction(input: CreateWebsiteInput): Promise<Website> {
  try {
    // Validate input
    if (!input.title || !input.link || !input.ownerId || !input.folderId) {
      throw new Error("Title, link, ownerId, and folderId are required");
    }

    // Verify folder exists and belongs to the user
    if (input.folderId !== "root") {
      const folder = await db.folder.findUnique({
        where: { id: input.folderId },
      });

      if (!folder) {
        throw new Error("Folder not found");
      }

      if (folder.userId !== input.ownerId) {
        throw new Error("Unauthorized: Folder belongs to another user");
      }
    }

    // Create the website
    const website = await db.website.create({
      data: {
        title: input.title,
        link: input.link,
        description: input.description,
        image: input.image,
        icon: input.icon,
        color: input.color,
        ownerId: input.ownerId,
        folders: input.folderId !== "root" ? {
          connect: { id: input.folderId },
        } : undefined,
        tags: input.tagIds && input.tagIds.length > 0 ? {
          connect: input.tagIds.map((tagId) => ({ id: tagId })),
        } : undefined,
      },
      include: {
        folders: true,
        tags: true,
      },
    });

    return website;
  } catch (error) {
    console.error("Error creating website:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create website");
  }
}
