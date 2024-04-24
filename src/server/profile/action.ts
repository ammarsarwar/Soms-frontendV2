'use server'

import { getCurrentUser } from "@/lib/session";
import { getServerSession } from "next-auth";
import { ChangePasswordSchema, TChangePasswordSchema } from "@/schemas";
import { authOptions } from "@/lib/auth";

//login profile
const loginProfile = "SA";
const baseURL = process.env.BACKEND_URL;

async function getToken() {
    const user = await getCurrentUser();
    if (user && user?.access_token) {
      return user?.access_token;
    }
    throw new Error("No session token available");
  }

export async function postChangePassword(values: TChangePasswordSchema) {
    const validatedValues = ChangePasswordSchema.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Invalid fields!" };
    }
    
    const token = await getToken();
    if (!token) {
      return { error: "No session found, Please login again!" };
    }
    const {new_password, old_password} = validatedValues.data
    const refinedData = {
        old_password,
        new_password
    }
    const session = await getServerSession(authOptions)
    try {
      const token = await getToken();
      const response = await fetch(`${baseURL}api/user/change_password/${session?.user.id}/?login_profile=${loginProfile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "Patch",
       body: JSON.stringify(refinedData)
      });
      if (response.ok) {
        return { success: "Successfully changed user password" };
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.detail || "Error updating user password";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    } 
  }