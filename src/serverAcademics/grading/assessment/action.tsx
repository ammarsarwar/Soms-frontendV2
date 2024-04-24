"use server";

import { getCurrentUser } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const baseURL = process.env.BACKEND_URL;
const login_profile = "AC";

async function getToken() {
  const user = await getCurrentUser();
  if (user && user?.access_token) {
    return user?.access_token;
  }
  throw new Error("No session token available");
}

export async function getAssessments() {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/grading/quiz_creation/?login_profile=${login_profile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`assessments`],
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      // const validatedData = z.array(AcademicYearSchema).safeParse(data.results)
      // if(!validatedData.success){
      //   console.error("Get Academic Year error: data on the based is changed or inconsistent please check your data and the schema",validatedData.error)
      //   return []
      // }
      return Array.isArray(data?.results) ? data.results : [];
    } else {
      console.error(
        "Assessment Get Error:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Assessment Get Error:", error);
    return [];
  }
}

export async function getAssessmentsByCourseId(course: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/grading/quiz_creation/?login_profile=${login_profile}&course=${course}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`assessmentsby${course}`],
        },
      }
    );
    const data = await response.json();
    // console.log("assessment data", data);
    if (response.ok) {
      // const validatedData = z.array(AcademicYearSchema).safeParse(data.results)
      // if(!validatedData.success){
      //   console.error("Get Academic Year error: data on the based is changed or inconsistent please check your data and the schema",validatedData.error)
      //   return []
      // }
      return Array.isArray(data?.results) ? data.results : [];
    } else {
      console.error(
        `Assessment Get by courseid ${course} Error:`,
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error(`Assessment Get by courseid ${course} Error:`, error);
    return [];
  }
}

export async function postAssessment(values: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/grading/quiz_creation/create/?login_profile=${login_profile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(values),
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error(
        `Post assessment error: Error fecting years with status code  ${response.status}, Cause of error is ${response.statusText}`
      );
      return undefined;
    }
  } catch (error) {
    console.error("Post assessment error:", error);
    return undefined;
  } finally {
    revalidateTag(`assessmentsby${values.course}`);
  }
}
