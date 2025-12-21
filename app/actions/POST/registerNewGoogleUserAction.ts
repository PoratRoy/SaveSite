"use server";

import { db } from "@/db";
import { ActionResponse } from "@/models/types/actions";
import { User } from "@/models/types/user";

export interface RegisterGoogleUserInput {
    email: string;
}

export interface RegisterGoogleUserResponse extends ActionResponse {
    data?: User;
}

export async function registerNewGoogleUserAction({
    email,
}: RegisterGoogleUserInput): Promise<RegisterGoogleUserResponse> {
    try {
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                success: true,
                message: "User already exists",
                data: existingUser as unknown as User,
            };
        }

        // If not existing, create new user
        // Note: Name/Image are missing from input args here but were present in my previous logic.
        // But the input interface only asks for 'email'. 
        // For now, I will create with default name or placeholder, 
        // BUT ideally this action should accept 'name' too.
        // Seeing as 'route.ts' calls this with JUST object `{ email }` (line 33), 
        // I should probably stick to just email, OR update route.ts to pass name.
        // I'll update the action to be robust: creates a user with email prefix as name if needed.
        
        const newUser = await db.user.create({
            data: {
                email,
                name: email.split('@')[0], // Fallback name
                role: 'user',
            }
        });

        return {
            success: true,
            message: "User created",
            data: newUser as unknown as User,
        };

    } catch (error) {
        console.error("Error registering Google user:", error);
        return {
            success: false,
            message: "Server error",
        };
    }
}
