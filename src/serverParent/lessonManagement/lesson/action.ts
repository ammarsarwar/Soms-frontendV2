"use server";

import { getCurrentUser } from "@/lib/session";

import { revalidateTag } from "next/cache";
import { z } from "zod";

const baseURL = process.env.BACKEND_URL;

const loginProfile = "PA";

async function getToken() {
  const user = await getCurrentUser();
  if (user && user?.access_token) {
    return user?.access_token;
  }
  throw new Error("No session token available");
}

export async function getAssignedLessons(sectionID: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/management/?login_profile=${loginProfile}&section=${sectionID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["assignlessons"],
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("campus data", data.results)
    return data?.results;
  } catch (error) {
    console.error("Error in this function:", error);
    return null || [];
  }
}

export async function getAssignedLessonsBySection() {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/management/?login_profile=${loginProfile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["assignlessons"],
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("campus data", data.results)
    return data?.results;
  } catch (error) {
    console.error("Error in this function:", error);
    return null || [];
  }
}