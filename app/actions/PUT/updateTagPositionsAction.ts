"use server";

import { db } from "@/db";

interface UpdateTagPositionsInput {
  tagPositions: { id: string; position: number }[];
}

/**
 * Update positions for multiple tags
 */
export async function updateTagPositionsAction(input: UpdateTagPositionsInput): Promise<void> {
  try {
    // Update all tag positions in a transaction
    await db.$transaction(
      input.tagPositions.map(({ id, position }) =>
        db.tag.update({
          where: { id },
          data: { position },
        })
      )
    );
  } catch (error) {
    console.error("Error updating tag positions:", error);
    throw new Error("Failed to update tag positions");
  }
}
