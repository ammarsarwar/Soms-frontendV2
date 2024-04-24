"use server";
import { filteredTeachersWithRoleSchema } from "@/components/lessonManagement/assignLessons/assign-lesson-types";

import { getCurrentUser } from "@/lib/session";
import { AssignedLessonsSchema } from "@/schemas";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const baseURL = process.env.BACKEND_URL;

//url creation
const lessonGetApiUrl = `${baseURL}api/school/branch/campus/department/grade/section/course/`;
// const academicTermPostApiUrl = `${baseURL}api/school/semester/create/`;
const loginProfile = "TE";

// Construct the URL for get branches with query parameters
//get
const lessonGetApiUrlWithParams = new URL(lessonGetApiUrl);
lessonGetApiUrlWithParams.searchParams.append("login_profile", loginProfile);

//post
// const academicTermPostApiUrlWithParams = new URL(academicTermPostApiUrl);
// academicTermPostApiUrlWithParams.searchParams.append("login_profile", loginProfile);

async function getToken() {
  const user = await getCurrentUser();
  if (user && user?.access_token) {
    return user?.access_token;
  }
  throw new Error("No session token available");
}
export async function getAssignedLessons() {
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
    // let zodLessonErrors = {}
    if (response.ok) {
      const data: any = await response.json();
      console.log(data);
      const validatedData = z
        .array(AssignedLessonsSchema)
        .safeParse(data.results);
      if (!validatedData.success) {
        // validatedData.error.issues.forEach((issue)=>{
        //     zodLessonErrors = {...zodLessonErrors, [issue.path[0]]: issue.message};
        // })
        console.error("Get assinged lessons error: ", validatedData.error);
        return [];
      }
      console.log("validated data,", validatedData.data);
      return validatedData.data;
    } else {
      console.error(
        "Lessons assinged Get Error:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Lessons assinged Get Error:", error);
    return [];
  }
}
