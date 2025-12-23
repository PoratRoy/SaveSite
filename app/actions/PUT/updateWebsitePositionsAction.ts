"use server";

import { db } from "@/db";

interface UpdateWebsitePositionsInput {
  websitePositions: { id: string; position: number }[];
}

/**
 * Update positions for multiple websites
 */
export async function updateWebsitePositionsAction(input: UpdateWebsitePositionsInput): Promise<void> {
  try {
    // Update all website positions in a transaction
    await db.$transaction(
      input.websitePositions.map(({ id, position }) =>
        db.website.update({
          where: { id },
          data: { position },
        })
      )
    );
  } catch (error) {
    console.error("Error updating website positions:", error);
    throw new Error("Failed to update website positions");
  }
}
