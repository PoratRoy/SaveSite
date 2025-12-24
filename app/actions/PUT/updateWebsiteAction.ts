"use server";

import { db } from "@/db";
import { Website } from "@/models/types/website";

interface UpdateWebsiteInput {
  websiteId: string;
  userId: string;
  title?: string;
  link?: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  color?: string | null;
  tagIds?: string[];
}

/**
 * Update a website's information
 */
export async function updateWebsiteAction(
  input: UpdateWebsiteInput
): Promise<Website> {
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

    // Update the website
    const updatedWebsite = await db.website.update({
      where: { id: input.websiteId },
      data: {
        title: input.title,
        link: input.link,
        description: input.description,
        image: input.image,
        icon: input.icon,
        color: input.color,
        tags: input.tagIds
          ? {
              set: input.tagIds.map((tagId: string) => ({ id: tagId })),
            }
          : undefined,
      },
      include: {
        folders: true,
        tags: true,
      },
    });

    return updatedWebsite;
  } catch (error) {
    console.error("Error updating website:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update website"
    );
  }
}
