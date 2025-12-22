"use server";

import { db } from "@/db";

interface DeleteFolderInput {
  folderId: string;
  userId: string;
}

/**
 * Delete a folder and all its contents (subfolders and websites)
 * Cascade delete is handled by the database schema
 */
export async function deleteFolderAction(input: DeleteFolderInput): Promise<void> {
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

    // Delete the folder (cascade will handle children and websites)
    await db.folder.delete({
      where: { id: input.folderId },
    });
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete folder");
  }
}
