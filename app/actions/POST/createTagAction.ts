"use server";

import { db } from "@/db";
import { Tag } from "@/models/types/tag";

interface CreateTagInput {
  name: string;
}

/**
 * Create a new tag
 */
export async function createTagAction(input: CreateTagInput): Promise<Tag> {
  try {
    // Validate input
    if (!input.name || !input.name.trim()) {
      throw new Error("Tag name is required");
    }

    // Check if tag already exists
    const existingTag = await db.tag.findUnique({
      where: { name: input.name.trim() },
    });

    if (existingTag) {
      throw new Error("Tag already exists");
    }

    // Create tag
    const tag = await db.tag.create({
      data: {
        name: input.name.trim(),
      },
    });

    return tag;
  } catch (error) {
    console.error("Error creating tag:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create tag");
  }
}
