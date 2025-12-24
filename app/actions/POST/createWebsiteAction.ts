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

    // Validate tag IDs if provided
    let validTagIds: string[] = [];
    if (input.tagIds && input.tagIds.length > 0) {
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

    // Get websites in the SAME FOLDER to shift their positions (not all websites)
    const existingWebsites = await db.website.findMany({
      where: {
        ownerId: input.ownerId,
        folders: input.folderId !== "root" ? {
          some: { id: input.folderId }
        } : {
          none: {}
        }
      },
      orderBy: { position: 'asc' },
      select: { id: true, position: true },
    });

    // Create the website and shift existing ones in a transaction
    const website = await db.$transaction(async (tx: any) => {
      // Shift existing websites in the same folder down by 1
      if (existingWebsites.length > 0) {
        // Use updateMany for better performance
        await tx.website.updateMany({
          where: {
            id: { in: existingWebsites.map((w: { id: string, position: number }) => w.id) }
          },
          data: {
            position: { increment: 1 }
          }
        });
      }

      // Create new website at position 0
      return tx.website.create({
        data: {
          title: input.title,
          link: input.link,
          description: input.description,
          image: input.image,
          icon: input.icon,
          color: input.color,
          position: 0,
          ownerId: input.ownerId,
          folders: input.folderId !== "root" ? {
            connect: { id: input.folderId },
          } : undefined,
          tags: validTagIds.length > 0 ? {
            connect: validTagIds.map((tagId: string) => ({ id: tagId })),
          } : undefined,
        },
        include: {
          folders: true,
          tags: true,
        },
      });
    }, {
      timeout: 10000, // Increase timeout to 10 seconds
    });

    return website;
  } catch (error) {
    console.error("Error creating website:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create website");
  }
}
