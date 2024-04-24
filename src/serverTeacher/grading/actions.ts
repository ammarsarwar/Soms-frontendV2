"use server";

import { getCurrentUser } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const baseURL = process.env.BACKEND_URL;
const login_profile = "TE";

async function getToken() {
  const user = await getCurrentUser();
  if (user && user?.access_token) {
    return user?.access_token;
  }
  throw new Error("No session token available");
}

interface GradingDataProps {
  course: number | undefined;
}

export async function getSelectedStudentsForGradingByCourseId(
  data: GradingDataProps
) {
  // console.log(data)
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/grading/grade_record/?login_profile=${login_profile}&course=${data.course}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`studentGradesbycourse${data.course}`],
        },
      }
    );
    // let zodLessonErrors = {}
    if (response.ok) {
      const data: any = await response.json();
      return Array.isArray(data) ? data : [];
    } else {
      console.error(
        "Selected students for grading Get Error:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Selected students for grading Get Error:", error);
    return [];
  }
}
