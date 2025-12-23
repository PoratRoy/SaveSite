"use server";

import { db } from "@/db";
import { ActionResponse } from "@/models/types/actions";
import { User } from "@/models/types/user";

export interface RegisterGoogleUserInput {
    email: string;
    name?: string;
    image?: string;
}

export interface RegisterGoogleUserResponse extends ActionResponse {
    data?: User;
}

export async function registerNewGoogleUserAction({
    email,
    name,
    image,
}: RegisterGoogleUserInput): Promise<RegisterGoogleUserResponse> {
    try {
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            // Update image if provided and different
            if (image && existingUser.image !== image) {
                const updatedUser = await db.user.update({
                    where: { email },
                    data: { image },
                });
                return {
                    success: true,
                    message: "User already exists",
                    data: updatedUser as unknown as User,
                };
            }
            return {
                success: true,
                message: "User already exists",
                data: existingUser as unknown as User,
            };
        }

        // Create new user with Google profile data
        const newUser = await db.user.create({
            data: {
                email,
                name: name || email.split('@')[0], // Use provided name or fallback
                image: image || null,
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
