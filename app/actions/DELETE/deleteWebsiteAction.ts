"use server";

import { db } from "@/db";

interface DeleteWebsiteInput {
  websiteId: string;
  userId: string;
}

/**
 * Delete a website
 */
export async function deleteWebsiteAction(input: DeleteWebsiteInput): Promise<void> {
  try {
    // Validate input
    if (!input.websiteId || !input.userId) {
      throw new Error("WebsiteId and userId are required");
    }

    // Verify website exists and belongs to the user
    const website = await db.website.findUnique({
      where: { id: input.websiteId },
      select: { id: true, ownerId: true, position: true },
    });

    if (!website) {
      throw new Error("Website not found");
    }

    if (website.ownerId !== input.userId) {
      throw new Error("Unauthorized: Website belongs to another user");
    }

    // Delete the website and reindex positions in a transaction
    await db.$transaction(async (tx) => {
      // Delete the website
      await tx.website.delete({
        where: { id: input.websiteId },
      });

      // Get all websites with position greater than the deleted one
      const websitesToReindex = await tx.website.findMany({
        where: {
          ownerId: input.userId,
          position: { gt: website.position },
        },
        orderBy: { position: 'asc' },
        select: { id: true, position: true },
      });

      // Shift all websites after the deleted one up by 1
      if (websitesToReindex.length > 0) {
        await Promise.all(
          websitesToReindex.map((w) =>
            tx.website.update({
              where: { id: w.id },
              data: { position: w.position - 1 },
            })
          )
        );
      }
    });
  } catch (error) {
    console.error("Error deleting website:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete website");
  }
}
