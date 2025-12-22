"use server";

import { db } from "@/db";
import { Folder } from "@/models/types/folder";

interface UpdateFolderInput {
  folderId: string;
  userId: string;
  name?: string;
  parentId?: string | null;
}

/**
 * Update a folder's name or parent
 */
export async function updateFolderAction(input: UpdateFolderInput): Promise<Folder> {
  try {
    // Validate input
    if (!input.folderId || !input.userId) {
      throw new Error("FolderId and userId are required");
    }

    // Verify folder exists and belongs to the user
    const folder = await db.folder.findUnique({
      where: { id: input.folderId },
    });

    if (!folder) {
      throw new Error("Folder not found");
    }

    if (folder.userId !== input.userId) {
      throw new Error("Unauthorized: Folder belongs to another user");
    }

    // If parentId is being updated, verify it exists
    if (input.parentId !== undefined && input.parentId !== null && input.parentId !== "root") {
      const parentFolder = await db.folder.findUnique({
        where: { id: input.parentId },
      });

      if (!parentFolder) {
        throw new Error("Parent folder not found");
      }

      if (parentFolder.userId !== input.userId) {
        throw new Error("Unauthorized: Parent folder belongs to another user");
      }

      // Prevent circular references
      if (input.parentId === input.folderId) {
        throw new Error("A folder cannot be its own parent");
      }
    }

    // Update the folder
    const updatedFolder = await db.folder.update({
      where: { id: input.folderId },
      data: {
        name: input.name,
        parentId: input.parentId === "root" ? null : input.parentId,
      },
      include: {
        children: true,
        websites: true,
      },
    });

    return updatedFolder;
  } catch (error) {
    console.error("Error updating folder:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update folder");
  }
}
