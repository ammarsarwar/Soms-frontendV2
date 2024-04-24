'use server'

import { getCurrentUser } from "@/lib/session";
import { KgStudentReportCardDataSchema, StudentProfileListForReportsSchema, ZKgReportFormSchemaForKg, ZKgReportFormUpdateSchemaForKg, ZTKgReportFormSchemaForKg, ZTKgReportFormUpdateSchemaForKg } from "@/schemas";
import { z } from "zod";

const baseURL = process.env.BACKEND_URL;

//login profile
const loginProfile = "SA";

async function getToken() {
  const user = await getCurrentUser();
  if (user && user?.access_token) {
    return user?.access_token;
  }
  throw new Error("No session token available");
}

export async function getGenericStudentsBySection(sectionId: number) {
  try {
    const token = await getToken();
    const response = await fetch(`${baseURL}api/admissions/student_profile/?login_profile=${loginProfile}&section=${sectionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["genericstudents"],
      },
    });
    const data = await response.json();
    if (response.ok) {
      const validatedData = z.array(StudentProfileListForReportsSchema).safeParse(data.results);
      if(!validatedData.success){
        console.log(validatedData.error.issues[0].path)
        console.error("Get Student profile list for reports Year error: data on the based is changed or inconsistent please check your data and the schema",validatedData.error)
        return []
      }
      return validatedData.data
    } else {
      console.error(`Get academic year error: Error fecting years with status code  ${response.status}, Cause of error is ${response.statusText}`);
      return []; 
    }
  } catch (error) {
    console.error("Get Academic Year error:", error);
    return []; 
  }
}


export async function getStudentReportDataForGrades(studentId: number) {
  try {
    const token = await getToken();
    const response = await fetch(`${baseURL}api/grading/grade_semester_transcript/?login_profile=${loginProfile}&student=${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
     
    });
    const data = await response.json();
    return {success: "Successfully generated student report" , report: data}
  } catch (error) {
    console.error("Get Academic Year error:", error);
    return {error: "Error generating student report" , report: null}
  }
}

export async function getStudentReportDataForKg(studentId: number) {
  try {
    const token = await getToken();
    const response = await fetch(`${baseURL}api/grading/kg_annual_transcript/?login_profile=${loginProfile}&student=${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
     
    });
    const data = await response.json();
    if (response.ok) {
      const validatedData = KgStudentReportCardDataSchema.safeParse(data)
      if(!validatedData.success){
        console.error("Get Kg Stduent Report Data Error: data on the based is changed or inconsistent please check your data and the schema",validatedData.error)
        return {error: "Error fetching student information please try again later"}
      }
      return {data: validatedData.data}
    } else {
      console.error("Get Kg Stduent Report Data Error", response.status, response.statusText);
      return {error: "Error fetching student information please try again later"}
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return {error: "Error fetching student information please try again later"}
  }
}

export const postKgReportGenerate = async (values: ZTKgReportFormSchemaForKg) => {
  console.log(values)
  const validatedValues = ZKgReportFormSchemaForKg.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid fields!" };
  }

  const refinedData = {
    ...validatedValues.data,
    academic_year: Number(validatedValues.data.academic_year),
    student: Number(validatedValues.data.student),
  };
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }

  try {
    const response = await fetch(`${baseURL}api/grading/kg_report/create/?login_profile=${loginProfile}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refinedData),
    });
    if (response.ok) {
      return { success: "Successfully marked final evaluation" };
    } else {
      const errorResponse = await response.json();
      console.log(errorResponse)
      const errorMessage = errorResponse.detail || "Error marking student evaluation";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  }
  }


export const updateKgReportGenerate = async (values: ZTKgReportFormUpdateSchemaForKg, reportId: number) => {
  console.log(values)
  const validatedValues = ZKgReportFormUpdateSchemaForKg.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid fields!" };
  }

  const refinedData = {
    ...validatedValues.data,
    academic_year: Number(validatedValues.data.academic_year),
  };
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }

  try {
    const response = await fetch(`${baseURL}api/grading/kg_report/update/${reportId}/?login_profile=${loginProfile}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refinedData),
    });
    if (response.ok) {
      return { success: "Successfully updated final evaluation" };
    } else {
      const errorResponse = await response.json();
      console.log(errorResponse)
      const errorMessage = errorResponse.detail || "Error updating student evaluation";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  }
  }