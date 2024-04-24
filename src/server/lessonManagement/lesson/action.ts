'use server'
import {filteredTeachersWithRoleSchema } from "@/components/lessonManagement/assignLessons/assign-lesson-types";
import { getCurrentUser } from "@/lib/session";
import { AssignedLessonsSchema, LessonSchema, ZAssignLessonFormSchema, ZLessonUpdateSchema, ZPostFormLessonSchema, ZTAssignLessonFormSchema, ZTLessonUpdateSchema, ZTPostFormLessonSchema } from "@/schemas";
import { revalidateTag } from "next/cache";
import {z} from "zod"

const baseURL = process.env.BACKEND_URL;
const loginProfile = "SA";

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
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/?login_profile=${loginProfile}&dropdown=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["lessons"],
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      const validatedData = z.array(LessonSchema).safeParse(data);
      if (!validatedData.success) {
        console.error(
          "Get lessons error:: data on the based is changed or inconsistent please check your data and the schema",
          validatedData.error
        );
        return [];
      }
      return validatedData.data;
    } else {
      console.error("Get lessons error:", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Get lessons error:", error);
    return [];
  }
}

export async function getAssignedLessons() {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/management/?login_profile=${loginProfile}&dropdown=true`,
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
      console.log(data)
      const validatedData = z.array(AssignedLessonsSchema).safeParse(data);
      if (!validatedData.success) {
        // validatedData.error.issues.forEach((issue)=>{
        //     zodLessonErrors = {...zodLessonErrors, [issue.path[0]]: issue.message};
        // })
        console.error("Get assinged lessons error: ", validatedData.error);
        return [];
      }
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

export async function postLessons(values: ZTPostFormLessonSchema) {
  const validatedValues = ZPostFormLessonSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid fields!" };
  }

  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  const { grade, title } = validatedValues.data;
  const refinedData = {
    grade,

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
    if (response.ok) {
      return { success: "Successfully created a new lesson" };
    } else {
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.detail || "Error creating a new lesson";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("lessons");
  }
}

export async function updateLesson(
  values: ZTLessonUpdateSchema,
  lessonId: number
) {
  const validatedValues = ZLessonUpdateSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid fields!" };
  }

  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }

  try {
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/update/${lessonId}/?login_profile=${loginProfile}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );
    if (response.ok) {
      return { success: "Successfully updated the lesson details" };
    } else {
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.detail || "Error updating lesson details";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("lessons");
  }
}

export async function postAssignLessons(values: ZTAssignLessonFormSchema) {
  const validatedValues = ZAssignLessonFormSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid fields!" };
  }

  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  // console.log(values)
  const { lesson, section, teacher } = validatedValues.data;
  const refinedData = {
    section: Number(section),
    teacher: Number(teacher),
    course: Number(lesson),
  };
  console.log(refinedData)
  try {
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
    if (response.ok) {
      return { success: "Successfully assigned a new lesson" };
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.detail || "Error assigning new lesson";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("assignlessons");
  }
}

export async function getSelectedLessons(gradeId: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/?login_profile=${loginProfile}&grade=${gradeId}&dropdown=true`,
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
      const validatedData = z.array(LessonSchema).safeParse(data);
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



export async function getGenericLessonsByGrade(gradeId: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/?login_profile=${loginProfile}&grade=${gradeId}&dropdown=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`lessonsbysectionid${gradeId}`],
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Selected lessons by section id Get Error:", error);
    return [];
  }
}

export async function getSelectedLessonsBySection(sectionId: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/management/?login_profile=${loginProfile}&section=${sectionId}&dropdown=true`,
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
    return data;
  } catch (error) {
    console.error("Selected lessons by section id Get Error:", error);
    return [];
  }
}

export async function getLessonBySection(sectionId: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/course/?login_profile=${loginProfile}&section=${sectionId}&dropdown=true`,
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
      const validatedData = z.array(AssignedLessonsSchema).safeParse(data);
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
        `${baseURL}/api/user/profile/?login_profile=${loginProfile}&userRole=TE&campus=${campusId}&dropdown=true`,
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
          .safeParse(data);
        if(!validatedData.success){
            // validatedData.error.issues.forEach((issue)=>{
            //     zodLessonErrors = {...zodLessonErrors, [issue.path[0]]: issue.message};
            // })
            console.error("Get selected teachers error: ",validatedData.error)
            return []
        }
        // console.log("validated data,", validatedData.data)
        return validatedData.data
      } else {
        console.error("Selected teachers Get Error:", response.status, response.statusText);
        return []; 
      }
    } catch (error) {
      console.error("Selected teachers Get Error:", error);
      return []; 
    }
  }