"use server";

import { db } from "@/db";
import { Website } from "@/models/types/website";

interface MoveWebsiteInput {
  websiteId: string;
  targetFolderId: string;
  userId: string;
}

/**
 * Move a website from its current folder to a target folder
 */
export async function moveWebsiteAction(
  input: MoveWebsiteInput
): Promise<Website> {
  try {
    // Validate input
    if (!input.websiteId || !input.targetFolderId || !input.userId) {
      throw new Error("WebsiteId, targetFolderId, and userId are required");
    }

    // Verify website exists and belongs to the user
    const website = await db.website.findUnique({
      where: { id: input.websiteId },
      include: {
        folders: true,
      },
    });

    if (!website) {
      throw new Error("Website not found");
    }

    if (website.ownerId !== input.userId) {
      throw new Error("Unauthorized: Website belongs to another user");
    }

    // Verify target folder exists and belongs to the user
    const targetFolder = await db.folder.findUnique({
      where: { id: input.targetFolderId },
    });

    if (!targetFolder) {
      throw new Error("Target folder not found");
    }

    if (targetFolder.userId !== input.userId) {
      throw new Error("Unauthorized: Target folder belongs to another user");
    }

    // Get the current folder (assuming website is in one folder)
    const currentFolder = website.folders[0];

    // Don't move if already in target folder
    if (currentFolder && currentFolder.id === input.targetFolderId) {
      throw new Error("Website is already in the target folder");
    }

    // Get the highest position in the target folder
    const websitesInTargetFolder = await db.website.findMany({
      where: {
        folders: {
          some: {
            id: input.targetFolderId,
          },
        },
      },
      orderBy: {
        position: "desc",
      },
      take: 1,
    });

    const newPosition = websitesInTargetFolder.length > 0 
      ? websitesInTargetFolder[0].position + 1 
      : 0;

    // Move the website to the target folder
    const updatedWebsite = await db.website.update({
      where: { id: input.websiteId },
      data: {
        folders: {
          set: [{ id: input.targetFolderId }],
        },
        position: newPosition,
      },
      include: {
        folders: true,
        tags: true,
      },
    });

    return updatedWebsite;
  } catch (error) {
    console.error("Error moving website:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to move website"
    );
  }
}
