"use server";

import { db } from "@/db";
import { Folder } from "@/models/types/folder";

/**
 * Get the complete folder tree structure for a user
 * Returns the root folder with all nested children and websites
 */
export async function getFoldersTreeAction(userId: string): Promise<Folder | null> {
  try {
    // Get all folders and websites for the user
    const [folders, websites] = await Promise.all([
      db.folder.findMany({
        where: { userId },
        include: {
          websites: {
            include: {
              tags: true, // Include tags for each website
            },
            orderBy: {
              updatedAt: 'desc', // Sort websites by most recently updated first
            },
          },
        },
      }),
      db.website.findMany({
        where: { ownerId: userId },
        include: {
          folders: true,
          tags: true, // Include tags
        },
        orderBy: {
          updatedAt: 'desc', // Sort websites by most recently updated first
        },
      }),
    ]);

    if (folders.length === 0) {
      return null;
    }

    // Build the tree structure recursively
    const buildTree = (parentId: string | null): Folder[] => {
      return folders
        .filter((folder) => folder.parentId === parentId)
        .map((folder) => ({
          ...folder,
          children: buildTree(folder.id),
          websites: folder.websites || [],
        }));
    };

    // Get root folders (folders with no parent)
    const rootFolders = buildTree(null);

    // If there's a single root, return it; otherwise create a virtual root
    if (rootFolders.length === 1) {
      return rootFolders[0];
    }

    // Create a virtual root folder
    return {
      id: "root",
      name: "My Websites",
      userId,
      parentId: null,
      createdAt: new Date(),
      children: rootFolders,
      websites: [],
    };
  } catch (error) {
    console.error("Error fetching folders tree:", error);
    throw new Error("Failed to fetch folders tree");
  }
}
