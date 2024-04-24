'use server'

import { getCurrentUser } from "@/lib/session";
import { PostAttendenceSchema, TPostAttendenceSchema, TOptimizedStudentAttendenceSchema, OptimizedStudentAttendenceSchema, TUpdateAttendenceSchema, UpdateAttendenceSchema } from "@/schemas";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const baseURL = process.env.BACKEND_URL;
const login_profile = "SA"


async function getToken() {
    const user = await getCurrentUser();
    if (user && user?.access_token) {
      return user?.access_token;
    }
    throw new Error("No session token available");
  }


  interface AttendenceDataProps {
    course: number| undefined,
    date: string | undefined,
  }

export async function getSelectedStudentsForAttendanceByCourseIdAndDate(values: AttendenceDataProps) {
  // console.log(data)
    try {
      const token = await getToken();
      const response = await fetch(
        `${baseURL}api/attendance/optimized_list/?login_profile=${login_profile}&course=${values.course}&date=${values.date}&dropdown=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "GET",
          next: {
            tags: [`attendencebydate${values.date}andcourse${values.course}`],
          },
        }
      );
      const data: any = await response.json();
        const validatedData = z.array(OptimizedStudentAttendenceSchema).safeParse(data);
        if(!validatedData.success){
            // validatedData.error.issues.forEach((issue)=>{
            //     zodLessonErrors = {...zodLessonErrors, [issue.path[0]]: issue.message};
            // })
            console.error("Get assinged lessons error: ",validatedData.error)
            return []
        }
        return validatedData.data
    } catch (error) {
      console.error("Selected students for attendance Get Error:", error);
      return []; 
    }
  }


  export async function postStudentAttendence(values: TPostAttendenceSchema[]) {
    const validatedValues = z.array(PostAttendenceSchema).safeParse(values);
    if (!validatedValues.success) {
      return { error: "Invalid fields!" };
    }
    const token = await getToken();
    if (!token) {
      return { error: "No session found, Please login again!" };
    }
    // console.log(validatedValues)
    try {
      const response = await fetch(`${baseURL}api/attendance/create/?login_profile=${login_profile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
       body: JSON.stringify(validatedValues.data)
      });
      if (response.ok) {
        return { success: "Successfully marked attendance for this lesson" };
      } else {
        const errorResponse = await response.json();
        console.log(errorResponse)
        const errorMessage = errorResponse.detail || "Error marking attendance for this lesson";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    } finally {
      revalidateTag(`attendencebydate${values[0].date}andcourse${values[0].course}`);
    }
  }


  export async function updateStudentAttendence(values: TUpdateAttendenceSchema) {
    const validatedValues = UpdateAttendenceSchema.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Invalid fields!" };
    }
    const token = await getToken();
    if (!token) {
      return { error: "No session found, Please login again!" };
    }
    const {attendence_id, course,status,date} = validatedValues.data;
    const refinedDate = {
      course,
      status,
      date
    }
    try {
      const response = await fetch(`${baseURL}api/attendance/update/${attendence_id}/?login_profile=${login_profile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
       body: JSON.stringify(refinedDate)
      });
      if (response.ok) {
        return { success: "Successfully updated the attendance for this lesson" };
      } else {
        const errorResponse = await response.json();
        console.log(errorResponse)
        const errorMessage = errorResponse.detail || "Error updating attendance for this lesson";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    } finally {
      revalidateTag(`attendencebydate${date}andcourse${course}`);
    }
      
  }
