'use server'

import { ApplicationDataSchema, TApplicationDataSchema } from "@/schemas";
import { revalidateTag } from "next/cache";



const baseUrl = process.env.BACKEND_URL


  export async function postApplication(applicationData: TApplicationDataSchema) {
    const validatedValues = ApplicationDataSchema.safeParse(applicationData);
    if (!validatedValues.success) {
      return { error: "Invalid fields!" };
    }
    const refinedData = {
      ...validatedValues.data,
      applied_branch: Number(validatedValues.data.applied_branch),
      applied_grade: Number(validatedValues.data.applied_grade),
      scheduled_test: Number(validatedValues.data.scheduled_test)
    }
    try {
      const response = await fetch(`${baseUrl}api/admissions/application/create/`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(refinedData),
      });
      if (response.ok) {
        return { success: "Successfully submitted the student application" };
      } else {
        const errorResponse = await response.json();
        // console.log(errorResponse)
        const errorMessage = errorResponse.detail || "Error submitting the student application";
        return { error: errorMessage };
      }
    } catch (error) {
      console.error("Server request failed:", error);
      return { error: "Failed to process request." };
    }
  }

  export async function getBranchesForAdmission() {
    try {
      const response = await fetch(
        `${baseUrl}api/admissions/application/branch/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
          cache: "no-cache",
        }
      );
      if (response.ok) {
        const data = await response.json();

        // console.log("API response data:", data);
        return Array.isArray(data) ? data : [];
      } else {
        console.error("Error:", response.status, response.statusText);
        return [];
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  }

  // export async function getBranchesForAdmission() {
  //   try {
  //     const response = await fetch(`${baseUrl}api/admissions/application/branch/`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       method: "GET",
  //       cache: 'no-cache'
  //     });
    //   if (response.ok) {
    //     const data = await response.json();
    //     return data;
    //   } else {
    //     console.error("Error:", response.status, response.statusText);
    //     return []
    //   }
    // } catch (error) {
    //   console.error("Fetch error:", error);
    //   return []
    // }
  // }

    export async function getCampusForAdmission(data: any) {
      // console.log(data)
      try {
        const response = await fetch(
          `${baseUrl}api/admissions/application/campus/?branch=${data.branch}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
            cache: "no-cache",
          }
        );
        if (response.ok) {
          const data = await response.json();
          // console.log(data)
          return data;
        } else {
          console.error("Error:", response.status, response.statusText);
          return [];
        }
      } catch (error) {
        console.error("Fetch error:", error);
        return [];
      }
    }

    export async function getGradesForAdmission(data: any) {
      // console.log(data)
      try {
        const response = await fetch(
          `${baseUrl}api/admissions/application/available_grades/?campus=${data.campus}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
            cache: "no-cache",
          }
        );
        if (response.ok) {
          const data = await response.json();
          // console.log(data)
          return data;
        } else {
          console.error("Error:", response.status, response.statusText);
          return [];
        }
      } catch (error) {
        console.error("Fetch error:", error);
        return [];
      }
    }


  export async function getSlotsForAdmission(departmentId: any) {
    try {
      const response = await fetch(`${baseUrl}api/admissions/test_slot/parent/?department=${departmentId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
        cache: 'no-cache'
      });
      if (response.ok) {
        const data = await response.json();
        const slotListData = data.results
        // console.log("dept id for admission:", departmentId, "slotListData", slotListData)
        return slotListData;
      } else {
        console.error("Error:", response.status, response.statusText);
        return []
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return []
    }
  }


  export async function getTimesForAdmission(date: any, departmentId: any) {
    // console.log("server data", date, "dept id", departmentId)
    try {
      const response = await fetch(`${baseUrl}api/admissions/test_slot/parent/?department=${departmentId}&date=${date}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
       cache: 'no-cache'
      });
      if (response.ok) {
        const data = await response.json();
        const slotListData = data.results
        return slotListData;
      } else {
        console.error("Error:", response.status, response.statusText);
        return []
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return []
    }
  }