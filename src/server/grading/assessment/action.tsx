"use server";

import { getCurrentUser } from "@/lib/session";
import {
  AssessemntInfoSchema,
  KgAssessmentSchema,
  ZAssessmentFormSchema,
  ZKgAssessmentFormSchema,
  ZTAssessmentFormSchema,
  ZTKgAssessmentFormSchema,
} from "@/schemas";
import { error } from "console";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const baseURL = process.env.BACKEND_URL;
const login_profile = "SA";

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
      `${baseURL}api/grading/quiz_creation/?login_profile=${login_profile}&dropdown=true`,
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
      return Array.isArray(data) ? data : [];
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

export async function getAssessmentsByGenericLessonId(
  lesson: number | undefined
) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/grading/kg_assessment/?login_profile=${login_profile}&generic_course=${lesson}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`assessmentsbylesson${lesson}`],
        },
      }
    );
    const data = await response.json();
    console.log(data.results);
    if (response.ok) {
      const validatedData = z.array(KgAssessmentSchema).safeParse(data.results);
      if (!validatedData.success) {
        console.error(
          "Get assessments error error: data on the based is changed or inconsistent please check your data and the schema",
          validatedData.error
        );
        return [];
      }
      return validatedData.data;
    } else {
      console.error("Error:", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export async function getAssessmentsByGradesId(grade: number | undefined) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/grading/quiz_creation/?login_profile=${login_profile}&grade=${grade}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`assessmentsbygrade${grade}`],
        },
      }
    );
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      const validatedData = z
        .array(AssessemntInfoSchema)
        .safeParse(data.results);
      if (!validatedData.success) {
        console.error(
          "Get assessments error error: data on the based is changed or inconsistent please check your data and the schema",
          validatedData.error
        );
        return [];
      }
      return validatedData.data;
    } else {
      console.error("Error:", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export async function postAssessment(
  values: ZTAssessmentFormSchema,
  grade: number | undefined
) {
  console.log(values);
  if (grade === undefined) {
    return { error: "Something went wrong, Please try again later" };
  }
  const validatedAssessment = ZAssessmentFormSchema.safeParse(values);
  if (!validatedAssessment.success) {
    return { error: "Invalid fields!" };
  }
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  const refinedData = {
    ...validatedAssessment.data,
    grade,
    total_marks: Number(validatedAssessment.data.total_marks),
    weightage: Number(validatedAssessment.data.weightage),
  };
  try {
    const response = await fetch(
      `${baseURL}api/grading/quiz_creation/create/?login_profile=${login_profile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(refinedData),
      }
    );
    if (response.ok) {
      return { success: "Successfully created a new assessment" };
    } else {
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.detail || "Error creating a new assessment";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag(`assessmentsbygrade${grade}`);
  }
}

export async function updateAssessment(
  values: ZTAssessmentFormSchema,
  grade: number | undefined,
  quizID: number | undefined
) {
  console.log(values);
  if (grade === undefined) {
    return { error: "Something went wrong, Please try again later" };
  }
  const validatedAssessment = ZAssessmentFormSchema.safeParse(values);
  if (!validatedAssessment.success) {
    return { error: "Invalid fields!" };
  }
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  const refinedData = {
    ...validatedAssessment.data,

    total_marks: Number(validatedAssessment.data.total_marks),
    weightage: Number(validatedAssessment.data.weightage),
  };
  try {
    const response = await fetch(
      `${baseURL}api/grading/quiz_creation/update/quiz_creation_id=${quizID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(refinedData),
      }
    );
    if (response.ok) {
      return { success: "Successfully updated assessment" };
    } else {
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.detail || "Error updating a assessment";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag(`assessmentsbygrade${grade}`);
  }
}



export async function postKgAssessment(
  values: ZTKgAssessmentFormSchema,
  lesson: number | undefined
) {
  if (lesson === undefined) {
    return { error: "Something went wrong, Please try again later" };
  }
  const validatedAssessment = ZKgAssessmentFormSchema.safeParse(values);
  if (!validatedAssessment.success) {
    return { error: "Invalid fields!" };
  }
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  const refinedData = {
    ...validatedAssessment.data,
    generic_course: lesson,
  };
  try {
    const response = await fetch(
      `${baseURL}api/grading/kg_assessment/create/?login_profile=${login_profile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(refinedData),
      }
    );
    if (response.ok) {
      return { success: "Successfully created a new assessment" };
    } else {
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.detail || "Error creating a new assessment";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag(`assessmentsbylesson${lesson}`);
  }
}
