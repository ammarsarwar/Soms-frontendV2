'use server'
import { getCurrentUser } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import {AdmissionCalenderDisableSchema, AdmissionCalenderSchema, TAdmissionCalenderDisableSchema, ZCalenderFormSchema, ZTCalenderFormSchema} from "@/schemas"
import { format } from "date-fns";

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
  
  export async function getAdmissionCalenders() {
    try {
        const token = await getToken();
        const response = await fetch(`${baseURL}api/admissions/calendar/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "GET",
          next: {
            tags: ["admissionscalenderlist"],
          },
        });
        const data = await response.json();
        if (response.ok) {
          const validatedData = z.array(AdmissionCalenderSchema).safeParse(data.results)
          if(!validatedData.success){
            console.error("Get admissions calender error: data on the based is changed or inconsistent please check your data and the schema",validatedData.error)
            return []
          }
          return validatedData.data
        } else {
          console.error(`Get admissions calender error: Error fecting years with status code  ${response.status}, Cause of error is ${response.statusText}`);
          return []; 
        }
      } catch (error) {
        console.error("Get admissions calender error:", error);
        return []; 
      }
  }


  export async function postAdmissionCalenderClose(values: TAdmissionCalenderDisableSchema) {
    const validatedValues = AdmissionCalenderDisableSchema.safeParse(values);
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
      const response = await fetch(`${baseURL}api/admissions/calendar/update/${id}/?login_profile=SA`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
       body: JSON.stringify(refinedData)
      });
      if (response.ok) {
        return { success: "Successfully updated the status of this admission calender" };
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.detail || "Error updating the status of this admission calender";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    } finally {
      revalidateTag("academicterm");
    }
  }

 


  export async function postAdmissionCalender(values: ZTCalenderFormSchema) {
    const validatedValues = ZCalenderFormSchema.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Invalid fields!" };
    }
    const refinedData = {
      academic_year: Number(validatedValues.data.academic_year),
      start_date: format(validatedValues.data.start_date, 'yyyy-MM-dd'),
      end_date: format(validatedValues.data.end_date, 'yyyy-MM-dd')
    }
    
    const token = await getToken();
    if (!token) {
      return { error: "No session found, Please login again!" };
    }

    try {
      const token = await getToken();
      const response = await fetch(`${baseURL}api/admissions/calendar/create/?login_profile=${loginProfile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
       body: JSON.stringify(refinedData)
      });
      if (response.ok) {
        return { success: "Successfully created a new admission calender!" };
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.detail || "Error creating new admission calender";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    } finally {
      revalidateTag("admissionscalenderlist");
    }
  }

  export async function updateAdmissionCalendar(
    calendarID: any,
    updatedValues: any
  ) {
    try {
      const token = await getToken();
      const response = await fetch(
        `${baseURL}api/admissions/calendar/update/${calendarID}/`,
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
        revalidateTag("admissionscalenderlist");
        return data;
      } else {
        console.error("Error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }