"use server";

import { db } from "@/db";
import { Prisma } from "@prisma/client";

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
 * - All websites that belong ONLY to these folders
 * - All folder-website relationships
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
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Find all websites in these folders
      const websitesInFolders = await tx.website.findMany({
        where: {
          folders: {
            some: {
              id: {
                in: folderIdsToDelete,
              },
            },
          },
        },
        include: {
          folders: {
            select: { id: true },
          },
        },
      });

      // 2. Identify websites that ONLY belong to folders being deleted
      const websiteIdsToDelete: string[] = [];
      for (const website of websitesInFolders) {
        const folderIds = website.folders.map(f => f.id);
        const hasOtherFolders = folderIds.some(id => !folderIdsToDelete.includes(id));
        
        // If website doesn't belong to any other folder, delete it
        if (!hasOtherFolders) {
          websiteIdsToDelete.push(website.id);
        }
      }

      // 3. Delete websites that only belong to these folders
      if (websiteIdsToDelete.length > 0) {
        await tx.website.deleteMany({
          where: {
            id: {
              in: websiteIdsToDelete,
            },
          },
        });
      }

      // 4. Disconnect remaining websites from these folders
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

      // 5. Delete all folders in the hierarchy
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
