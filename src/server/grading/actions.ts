'use server'

import { getCurrentUser } from "@/lib/session";
import { StudentGradingSchema, StudentKgGradingSchema } from "@/schemas";
import { revalidateTag } from "next/cache";
import {z} from "zod"

const baseURL = process.env.BACKEND_URL;
const login_profile = "SA"


async function getToken() {
    const user = await getCurrentUser();
    if (user && user?.access_token) {
      return user?.access_token;
    }
    throw new Error("No session token available");
  }


  interface GradingDataProps {
    course: number| undefined,
  }

export async function getSelectedStudentsForGradingByCourseId(values: GradingDataProps) {
  // console.log(data)
    try {
      const token = await getToken();
      const response = await fetch(`${baseURL}api/grading/grade_record/?login_profile=${login_profile}&course=${values.course}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`studentGradesbycourse${values.course}`],
        },
      });
      const data: any = await response.json();
      if (response.ok) {
        const validatedData = z.array(StudentGradingSchema).safeParse(data)
        if(!validatedData.success){
          console.error("Get lessons error:: data on the based is changed or inconsistent please check your data and the schema",validatedData.error)
          return []
        }
        return validatedData.data
      } else {
        console.error("Get lessons error:", response.status, response.statusText);
        return []; 
      }
    } catch (error) {
      console.error("Get lessons error:", error);
      return []; 
    }
  }


export async function getSelectedStudentsForGradingByCourseIdForKg(values: GradingDataProps) {
  console.log(values)
    try {
      const token = await getToken();
      const response = await fetch(`${baseURL}api/grading/kg_assessment_record/?login_profile=${login_profile}&course=${values.course}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`studentGradesbycourseforkg${values.course}`],
        },
      });
      const data: any = await response.json();
      console.log(data)
      if (response.ok) {
        const validatedData = z.array(StudentKgGradingSchema).safeParse(data)
        if(!validatedData.success){
          console.error("Get kg students for grading error:: data on the based is changed or inconsistent please check your data and the schema",validatedData.error)
          return []
        }
        return validatedData.data
      } else {
        console.error("Get kg students for grading error:", response.status, response.statusText);
        return []; 
      }
    } catch (error) {
      console.error("Get kg students for grading error:", error);
      return []; 
    }
  }