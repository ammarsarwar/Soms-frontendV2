"use server";

import { getCurrentUser } from "@/lib/session";
import { KgAssessmentSchemaWithIdKey, QuizSchema, StudentGradingSchema, StudentKgGradingSchema, TKgAssessemntInfoSchema, TKgAssessmentSchemaWithIdKey, TQuizSchema, TStudentGradingSchema, TStudentKgGradingSchema, ZEditKgMarksFormSchema, ZEditMarksFormSchema, ZTEditKgMarksFormSchema, ZTEditMarksFormSchema } from "@/schemas";
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

export async function postQuizMarks( values: ZTEditMarksFormSchema,
  quiz: TQuizSchema,
  gradingRow: TStudentGradingSchema) {
  const validatedEditMarksValues = ZEditMarksFormSchema.safeParse(values);
  if (!validatedEditMarksValues.success) {
    return { error: "Invalid fields!" };
  }
  const validatedQuiz = QuizSchema.safeParse(quiz);
  if (!validatedQuiz.success) {
    return { error: "Invalid fields!" };
  }
  const validatedRowData = StudentGradingSchema.safeParse(gradingRow);
  if (!validatedRowData.success) {
    return { error: "Invalid fields!" };
  }
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
    const refinedData = {
      obtained_marks: Number(validatedEditMarksValues.data.obtained_marks),
      student: validatedRowData.data.id,
      quiz: validatedQuiz.data.id,
      course: validatedRowData.data.course
    };
    try {
      const response = await fetch(
        `${baseURL}api/grading/grade_record/create/?login_profile=${login_profile}`,
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
        return { success: "Successfully marked quiz for this student" };
      } else {
        const errorResponse = await response.json();
        // console.log(errorResponse)
        const errorMessage = errorResponse.detail || "Error marking quiz for this student";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    }
  }


export async function postKgQuizMarks( values: ZTEditKgMarksFormSchema,
  quiz: TKgAssessmentSchemaWithIdKey,
  gradingRow: TStudentKgGradingSchema) {

  const validatedEditMarksValues = ZEditKgMarksFormSchema.safeParse(values);
  if (!validatedEditMarksValues.success) {
    return { error: "Invalid fields!" };
  }

  const validatedQuiz = KgAssessmentSchemaWithIdKey.safeParse(quiz);
  if (!validatedQuiz.success) {
    return { error: "Invalid fields!" };
  }

  const validatedRowData = StudentKgGradingSchema.safeParse(gradingRow);
  if (!validatedRowData.success) {
    return { error: "Invalid fields!" };
  }

  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }

    const refinedData = {
      performance_key: Number(validatedEditMarksValues.data.performance_key),
      student: validatedRowData.data.id,
      assessment: validatedQuiz.data.id,
    };

    try {
      const response = await fetch(
        `${baseURL}api/grading/kg_assessment_record/create/?login_profile=${login_profile}`,
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
        return { success: "Successfully marked performance for this student" };
      } else {
        const errorResponse = await response.json();
        // console.log(errorResponse)
        const errorMessage = errorResponse.detail || "Error marking performance for this student";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    }
  }


export async function editQuizMarks(values: ZTEditMarksFormSchema, quiz: TQuizSchema) {
  const validatedEditMarksValues = ZEditMarksFormSchema.safeParse(values);
  if (!validatedEditMarksValues.success) {
    return { error: "Invalid fields!" };
  }
  const validatedQuiz = QuizSchema.safeParse(quiz);
  if (!validatedQuiz.success) {
    return { error: "Invalid fields!" };
  }
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
    const refinedData = {
        obtained_marks: Number(validatedEditMarksValues.data.obtained_marks)
    }
    try {
      const response = await fetch(
        `${baseURL}api/grading/grade_record/update/${quiz.grade_record}/?login_profile=${login_profile}`,
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
        return { success: "Successfully updated the marks" };
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.detail || "Error updating the marks";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    }
}

export async function editKgQuizMarks(values: ZTEditKgMarksFormSchema, quiz: TKgAssessmentSchemaWithIdKey) {
  const validatedEditMarksValues = ZEditKgMarksFormSchema.safeParse(values);
  if (!validatedEditMarksValues.success) {
    return { error: "Invalid fields!" };
  }
  const validatedQuiz = KgAssessmentSchemaWithIdKey.safeParse(quiz);
  if (!validatedQuiz.success) {
    return { error: "Invalid fields!" };
  }
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
    const refinedData = {
        performance_key: Number(validatedEditMarksValues.data.performance_key)
    }
    try {
      const response = await fetch(
        `${baseURL}api/grading/kg_assessment_record/update/${quiz.assessment_record}/?login_profile=${login_profile}`,
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
        return { success: "Successfully updated the marks" };
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.detail || "Error updating the marks";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    }
}