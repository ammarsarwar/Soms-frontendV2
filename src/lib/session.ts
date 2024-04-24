import { getServerSession } from "next-auth/next"

import { authOptions } from "./auth"

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    if (session && session.user) {
        return session.user;
    } else {
        return null;
    }
} catch (error) {
    console.error("Error getting current user:", error);
    return null;
}
}