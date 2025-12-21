"use server";

import { db } from "@/db";
import { User } from "@/models/types/user";

type GetUserByEmailResponse = {
    success: boolean;
    message: string;
    data?: User;
};

export async function getUserByEmailAction(
    email: string,
): Promise<GetUserByEmailResponse> {
    try {
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) return { success: false, message: "User not found" };

        // Cast string role to UserRole if needed by consumers, though standard User interface uses string currently or UserRole type
        // The User type in models/types/user.ts was updated by user to use UserRole. 
        // We assume the DB string "user" matches the UserRole type.
        
        return { success: true, message: "User found", data: user as unknown as User };
    } catch (err) {
        console.error("Error getUserByEmailAction:", err);
        return { success: false, message: "Server error" };
    }
}
