'use server'

import { getCurrentUser } from "@/lib/session";
import { SchoolYearSchema, ZTSchoolYearFormSchema, ZSchoolYearFormSchema, TSchoolYearDisableSchema, SchoolYearDisableSchema } from "@/schemas/index";
import { revalidateTag } from "next/cache";
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
  
  export async function getAcademicYears() {
    try {
      const token = await getToken();
      const response = await fetch(`${baseURL}api/school/academicYear/?login_profile=${loginProfile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["schoolyear"],
        },
      });
      const data = await response.json();
      if (response.ok) {
        const validatedData = z.array(SchoolYearSchema).safeParse(data.results);
        if(!validatedData.success){
          console.error("Get Academic Year error: data on the based is changed or inconsistent please check your data and the schema",validatedData.error)
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

 export async function getActiveAcademicYears() {
   try {
     const token = await getToken();
     const response = await fetch(
       `${baseURL}api/school/academicYear/?login_profile=${loginProfile}&status=Active`,
       {
         headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
         },
         method: "GET",
         next: {
           tags: ["schoolyear"],
         },
       }
     );
     const data = await response.json();
     if (response.ok) {
       const validatedData = z.array(SchoolYearSchema).safeParse(data.results);
       if (!validatedData.success) {
         console.error(
           "Get Academic Year error: data on the based is changed or inconsistent please check your data and the schema",
           validatedData.error
         );
         return [];
       }
       return validatedData.data;
     } else {
       console.error(
         `Get academic year error: Error fecting years with status code  ${response.status}, Cause of error is ${response.statusText}`
       );
       return [];
     }
   } catch (error) {
     console.error("Get Academic Year error:", error);
     return [];
   }
 }

  export async function postAcademicYears(values: ZTSchoolYearFormSchema) {
    const validatedValues = ZSchoolYearFormSchema.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Invalid fields!" };
    }
    const token = await getToken();
    if (!token) {
      return { error: "No session found, Please login again!" };
    }
    const refinedData = {
      start_year: Number(validatedValues.data.start_year),
      end_year: Number(validatedValues.data.end_year),
    };
    try {
      const response = await fetch(
        `${baseURL}api/school/academicYear/create/?login_profile=${loginProfile}`,
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
        return { success: "Successfully created a new school year!" };
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.detail || "Error creating new school year";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    } finally {
      revalidateTag("schoolyear");
    }
  }

export async function updateSchoolYear(yearID: any, updatedValues: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/academicYear/update/${yearID}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(updatedValues), // Send only the updated campus data
      }
    );

    if (response.ok) {
      const data = await response.json();
      revalidateTag("schoolyear");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}


  export async function postAcademicYearsDeactivate(values: TSchoolYearDisableSchema) {
    const validatedValues = SchoolYearDisableSchema.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Invalid fields!" };
    }
    const token = await getToken();
    if (!token) {
      return { error: "No session found, Please login again!" };
    }
    const {id, status} = validatedValues.data;
    const refinedData = {
      status
    }
    try {
      const response = await fetch(`${baseURL}api/school/academicYear/update/${id}/?login_profile=${loginProfile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
       body: JSON.stringify(refinedData)
      });
      if (response.ok) {
        return { success: "Successfully updated the status of this school year" };
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.detail || "Error updating the status of this school year";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    } finally {
      revalidateTag("schoolyear");
    }
  }
  