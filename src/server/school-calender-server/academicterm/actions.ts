'use server'
import { getCurrentUser } from "@/lib/session";
import { ZAcademicTermFormSchema, ZTAcademicTermFormSchema, AcademicTermSchema, TAcadmicTermDisableSchema, AcadmicTermDisableSchema } from "@/schemas";
import { format } from "date-fns";
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
  
  export async function getAcademicTerms() {
    try {
      const token = await getToken();
      const response = await fetch(`${baseURL}api/school/semester/?login_profile=${loginProfile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["academicterm"],
        },
      });
      const data = await response.json();
      if (response.ok) {
        const validatedData = z.array(AcademicTermSchema).safeParse(data.results)
        if(!validatedData.success){
          console.error("Get Academic Year error: data on the based is changed or inconsistent please check your data and the schema",validatedData.error)
          return []
        }
        return validatedData.data
      } else {
        console.error("Error:", response.status, response.statusText);
        return []; 
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return []; 
    }
  }
  
  export async function getActiveAcademicTerm() {
    try {
      const token = await getToken();
      const response = await fetch(
        `${baseURL}api/school/semester/?login_profile=${loginProfile}&status=Active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "GET",
          next: {
            tags: ["academicterm"],
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data?.results) ? data.results : [];
      } else {
        console.error("Error:", response.status, response.statusText);
        return [];
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  }

  export const postAcademicTerms = async (values: ZTAcademicTermFormSchema) => {
    const validatedValues = ZAcademicTermFormSchema.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Invalid fields!" };
    }
  
    const refinedData = {
      ...validatedValues.data,
      academic_year: Number(validatedValues.data.academic_year),
      start_date: format(validatedValues.data.start_date, 'yyyy-MM-dd'),
      end_date: format(validatedValues.data.end_date, 'yyyy-MM-dd')
    };
    const token = await getToken();
    if (!token) {
      return { error: "No session found, Please login again!" };
    }
  
    try {
      const response = await fetch(`${baseURL}api/school/semester/create/?login_profile=${loginProfile}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(refinedData),
      });
      if (response.ok) {
        return { success: "Successfully created a new acadmic term!" };
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.detail || "Error creating new acadmic term";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    } finally {
      revalidateTag("academicterm");
    }
    }

  export async function postAcademicTermsDeactivate(values: TAcadmicTermDisableSchema) {
    const validatedValues = AcadmicTermDisableSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid fields!" };
  }
    const {id, status} = validatedValues.data;
    const refinedData = {
      status
    }
    const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  try {
    const response = await fetch(`${baseURL}api/school/semester/update/${id}/?login_profile=${loginProfile}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refinedData),
    });
    if (response.ok) {
      return { success: "Successfully updated the status of this acadmic term!" };
    } else {
      const errorResponse = await response.json();
      console.log(errorResponse)
      const errorMessage = errorResponse.detail || "Error updating the status of this acadmic term";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("academicterm");
  }
}


export async function updateAcademicTerm(termID: any, updatedValues: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/semester/update/${termID}/`,
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
      revalidateTag("academicterm");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}