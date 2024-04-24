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

interface AttendenceDataProps {
  course: number | undefined;
  date: string | undefined;
}

export async function getSelectedStudentsByCourseId(data: AttendenceDataProps) {
  // console.log(data)
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/attendance/optimized_list/?login_profile=${login_profile}&course=${data.course}&date=${data.date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`attendencebydate${data.date}andcourse${data.course}`],
        },
      }
    );
    // let zodLessonErrors = {}
    if (response.ok) {
      const data: any = await response.json();
      return Array.isArray(data) ? data : [];
    } else {
      console.error(
        "Selected students for attendance Get Error:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Selected students for attendance Get Error:", error);
    return [];
  }
}

export async function postStudentAttendence(values: any) {
  // console.log(values)
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/attendance/create/?login_profile=${login_profile}`,
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
        `Post student attendence: Error fecting years with status code  ${response.status}, Cause of error is ${response.statusText}`
      );
      return undefined;
    }
  } catch (error) {
    console.error("Post student attendence error:", error);
    return undefined;
  } finally {
    revalidateTag(`attendencebydate${values.date}andcourse${values.course}`);
  }
}

export async function updateStudentAttendence(values: any) {
  const { attendence_id, course, status, date } = values;
  const refinedDate = {
    course,
    status,
    date,
  };
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/attendance/update/${attendence_id}/?login_profile=${login_profile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(refinedDate),
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error(
        `Update student attendence: Error fecting years with status code  ${response.status}, Cause of error is ${response.statusText}`
      );
      return undefined;
    }
  } catch (error) {
    console.error("Update student attendence error:", error);
    return undefined;
  } finally {
    revalidateTag(`attendencebydate${date}andcourse${course}`);
  }
}
