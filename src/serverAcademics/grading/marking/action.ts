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

export async function postQuizMarks(values: any) {
  console.log(values);
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/grading/grade_record/create/?login_profile=${login_profile}`,
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
        `Post quiz marks error: Error fecting years with status code  ${response.status}, Cause of error is ${response.statusText}`
      );
      return undefined;
    }
  } catch (error) {
    console.error("Post quiz marks error:", error);
    return undefined;
  }
}

export async function editQuizMarks(values: any) {
  const refinedData = {
    obtained_marks: values.obtained_marks,
  };
  console.log(values);
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/grading/grade_record/update/${values.quiz}/?login_profile=${login_profile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(refinedData),
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error(
        `Edit quiz marks error: Error fecting years with status code  ${response.status}, Cause of error is ${response.statusText}`
      );
      return undefined;
    }
  } catch (error) {
    console.error("Edit quiz marks error:", error);
    return undefined;
  }
}
