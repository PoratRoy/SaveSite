"use server";

import { db } from "@/db";
import { folderSchema } from "@/models/schemas/folderSchema";
import { Folder } from "@/models/types/folder";

interface CreateFolderInput {
  name: string;
  userId: string;
  parentId?: string | null;
}

/**
 * Create a new folder
 */
export async function createFolderAction(input: CreateFolderInput): Promise<Folder> {
  try {
    // Validate input
    if (!input.name || !input.userId) {
      throw new Error("Name and userId are required");
    }

    // If parentId is provided, verify it exists
    if (input.parentId && input.parentId !== "root") {
      const parentFolder = await db.folder.findUnique({
        where: { id: input.parentId },
      });

      if (!parentFolder) {
        throw new Error("Parent folder not found");
      }

      if (parentFolder.userId !== input.userId) {
        throw new Error("Unauthorized: Parent folder belongs to another user");
      }
    }

    // Create the folder
    const folder = await db.folder.create({
      data: {
        name: input.name,
        userId: input.userId,
        parentId: input.parentId === "root" ? null : input.parentId,
      },
      include: {
        children: true,
        websites: true,
      },
    });

    return folder;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create folder");
  }
}
