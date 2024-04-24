"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzY4MTAyLCJpYXQiOjE3MDMyODE3MDIsImp0aSI6IjBjNTkyM2RkYzk4MzRiOGU5M2JiN2E0YzA3ZTE3MDJiIiwidXNlcl9pZCI6Mn0.i-Ltz1Pm848ZDlYaXy7p63VCZE_0cGBCwtKyQdgQ2iI";
const loginProfile = "NU";

const now = new Date();
const dateString = now.toISOString(); // Converts the current date and time to ISO string format

async function getToken() {
  const user = await getCurrentUser(); // Replace with your method of getting the session
  if (user && user?.access_token) {
    console.log("access token", user?.access_token);
    return user?.access_token; // Replace 'token' with the actual property name in your session
  }
  // Handle the case where there's no session or token
  throw new Error("No session token available");
}
export async function getGrades() {
  try {
    const token = await getToken();

    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/?login_profile=${loginProfile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`grade`],
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.results;
  } catch (error) {
    console.error("Error in getSelectedDept:", error);
    return null;
  }
}
