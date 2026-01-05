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

    // Validate tag IDs if provided
    let validTagIds: string[] = [];
    if (input.tagIds !== undefined) {
      if (input.tagIds.length > 0) {
        // Filter out empty strings and validate tags exist
        const nonEmptyTagIds = input.tagIds.filter((id: string) => id && id.trim() !== '');
        if (nonEmptyTagIds.length > 0) {
          const existingTags = await db.tag.findMany({
            where: { id: { in: nonEmptyTagIds } },
            select: { id: true },
          });
          validTagIds = existingTags.map((t: { id: string }) => t.id);
        }
      }
      // If tagIds is an empty array or all invalid, validTagIds will be empty array
      // This will clear all tags from the website
    }

    // Update the website
    // Convert empty strings to null to properly clear fields
    const updatedWebsite = await db.website.update({
      where: { id: input.websiteId },
      data: {
        title: input.title,
        link: input.link,
        description: input.description === '' ? null : input.description,
        image: input.image === '' ? null : input.image,
        icon: input.icon === '' ? null : input.icon,
        color: input.color === '' ? null : input.color,
        tags: input.tagIds !== undefined
          ? {
              set: validTagIds.map((tagId: string) => ({ id: tagId })),
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
