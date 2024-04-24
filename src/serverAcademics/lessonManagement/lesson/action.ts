"use server";
import { filteredTeachersWithRoleSchema } from "@/components/lessonManagement/assignLessons/assign-lesson-types";

import { getCurrentUser } from "@/lib/session";
import { AssignedLessonsSchema, LessonSchema } from "@/schemas";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const baseURL = process.env.BACKEND_URL;

//url creation
const lessonGetApiUrl = `${baseURL}api/school/branch/campus/department/grade/section/course/`;
// const academicTermPostApiUrl = `${baseURL}api/school/semester/create/`;
const loginProfile = "AC";

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

export async function getLessons() {
  try {
    const token = await getToken();
    const response = await fetch(lessonGetApiUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["lessons"],
      },
    });
    // let zodLessonErrors = {}
    if (response.ok) {
      const data: any = await response.json();
      // console.log(data)
      const validatedData = z.array(LessonSchema).safeParse(data.results);
      if (!validatedData.success) {
        // validatedData.error.issues.forEach((issue)=>{
        //     zodLessonErrors = {...zodLessonErrors, [issue.path[0]]: issue.message};
        // })
        console.error("Get lessons error: ", validatedData.error);
        return [];
      }
      // console.log("validated data,", validatedData.data)
      return validatedData.data;
    } else {
      console.error("Lessons Get Error:", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Lessons Get Error:", error);
    return [];
  }
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
      // console.log(data)
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
      // console.log("validated data,", validatedData.data)
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

export async function postLessons(values: any) {
  const { grade, max_grade, title } = values;
  const refinedData = {
    grade,
    max_grade,
    title,
  };
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/create/?login_profile=${loginProfile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(refinedData),
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error(
        `Post lesson error: Error fecting years with status code  ${response.status}, Cause of error is ${response.statusText}`
      );
      return undefined;
    }
  } catch (error) {
    console.error("Post lesson error:", error);
    return undefined;
  } finally {
    revalidateTag("lessons");
  }
}

export async function postAssignLessons(values: any) {
  // console.log(values)
  const { lesson, section, teacher } = values;
  const refinedData = {
    section: Number(section),
    teacher: Number(teacher),
    course: Number(lesson),
  };
  // console.log("lesson assign data",refinedData)
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/management/create/?login_profile=${loginProfile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(refinedData),
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error(
        `Post assign lessons error: Error fecting years with status code  ${response.status}, Cause of error is ${response.statusText}`
      );
      return undefined;
    }
  } catch (error) {
    console.error("Post assign lessons error:", error);
    return undefined;
  } finally {
    revalidateTag("assignlessons");
  }
}

export async function getSelectedLessons(gradeId: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/?login_profile=${loginProfile}&grade=${gradeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`sessonsbyid${gradeId}`],
        },
      }
    );
    // let zodLessonErrors = {}
    if (response.ok) {
      const data: any = await response.json();
      // console.log(data)
      const validatedData = z.array(LessonSchema).safeParse(data.results);
      if (!validatedData.success) {
        // validatedData.error.issues.forEach((issue)=>{
        //     zodLessonErrors = {...zodLessonErrors, [issue.path[0]]: issue.message};
        // })
        console.error("Get selected lessons error: ", validatedData.error);
        return [];
      }
      // console.log("validated data,", validatedData.data)
      return validatedData.data;
    } else {
      console.error(
        "Selected Lessons Get Error:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Selected Lessons Get Error:", error);
    return [];
  }
}

export async function getSelectedLessonsBySection(sectionId: any) {
  console.log("This is section id", sectionId);
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/management/?login_profile=${loginProfile}&section=${sectionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`lessonsbysectionid${sectionId}`],
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.results;
  } catch (error) {
    console.error("Selected lessons by section id Get Error:", error);
    return [];
  }
}

export async function getLessonBySection(sectionId: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/?login_profile=${loginProfile}&section=${sectionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`lessonsbysectionid${sectionId}`],
        },
      }
    );
    // let zodLessonErrors = {}
    if (response.ok) {
      const data: any = await response.json();
      const validatedData = z
        .array(AssignedLessonsSchema)
        .safeParse(data.results);
      if (!validatedData.success) {
        // validatedData.error.issues.forEach((issue)=>{
        //     zodLessonErrors = {...zodLessonErrors, [issue.path[0]]: issue.message};
        // })
        console.error(
          "Get selected lessons by section id error: ",
          validatedData.error
        );
        return [];
      }
      // console.log("validated data,", validatedData.data);
      return validatedData.data;
    } else {
      console.error(
        "Selected lessons by section id Get Error:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Selected lessons by section id Get Error:", error);
    return [];
  }
}

export async function getSelectedTeachers(campusId: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}/api/user/profile/?login_profile=${loginProfile}&userRole=TE&campus=${campusId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`Teachersbyid${campusId}`],
        },
      }
    );
    // let zodLessonErrors = {}
    if (response.ok) {
      const data: any = await response.json();
      // console.log(data)
      const validatedData = z
        .array(filteredTeachersWithRoleSchema)
        .safeParse(data.results);
      if (!validatedData.success) {
        // validatedData.error.issues.forEach((issue)=>{
        //     zodLessonErrors = {...zodLessonErrors, [issue.path[0]]: issue.message};
        // })
        console.error("Get selected teachers error: ", validatedData.error);
        return [];
      }
      // console.log("validated data,", validatedData.data)
      return validatedData.data;
    } else {
      console.error(
        "Selected teachers Get Error:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Selected teachers Get Error:", error);
    return [];
  }
}
