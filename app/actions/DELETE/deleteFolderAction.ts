"use server";

import { db } from "@/db";

interface DeleteFolderInput {
  folderId: string;
  userId: string;
}

/**
 * Recursively collect all folder IDs in the hierarchy
 */
async function collectFolderIds(folderId: string): Promise<string[]> {
  const folderIds: string[] = [folderId];
  
  // Get all children folders
  const children = await db.folder.findMany({
    where: { parentId: folderId },
    select: { id: true },
  });

  // Recursively collect IDs from children
  for (const child of children) {
    const childIds = await collectFolderIds(child.id);
    folderIds.push(...childIds);
  }

  return folderIds;
}

/**
 * Delete a folder and all its contents (subfolders and websites)
 * Explicitly handles cascade deletion of:
 * - All child folders recursively
 * - All folder-website relationships
 * - Websites that are only in these folders (optional)
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

    // Collect all folder IDs in the hierarchy
    const folderIdsToDelete = await collectFolderIds(input.folderId);

    // Use a transaction to ensure all operations succeed or fail together
    await db.$transaction(async (tx) => {
      // 1. Disconnect all websites from these folders (many-to-many cleanup)
      // We need to disconnect each folder individually for relation updates
      for (const folderId of folderIdsToDelete) {
        await tx.folder.update({
          where: { id: folderId },
          data: { 
            websites: { 
              set: [] 
            } 
          },
        });
      }

      // 2. Delete all folders in the hierarchy
      // The database cascade will handle child folders, but we delete explicitly
      // Delete in reverse order (children first) to avoid foreign key issues
      for (let i = folderIdsToDelete.length - 1; i >= 0; i--) {
        await tx.folder.delete({
          where: { id: folderIdsToDelete[i] },
        });
      }
    });
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete folder");
  }
}
