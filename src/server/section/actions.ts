"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateDeptGrade } from "../department/actions";
import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const sectionGetApiUrl = `${baseURL}/api/school/branch/campus/department/grade/section/`;
const sectionPostAPIURL = `${baseURL}api/school/branch/campus/department/grade/section/create/`;

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzYyNTU4LCJpYXQiOjE3MDMyNzYxNTgsImp0aSI6IjA1YzczMmZjYWU1NDQ0YTc5NmJmNzg2MmQ3YTQzOTJjIiwidXNlcl9pZCI6Mn0.9YPzDtVK0RPsD09CGwia8p_-cy81ikirWjoBF5R5o3s";
const loginProfile = "SA";

// Construct the URL for get branches with query parameters
const getUrlWithParams = new URL(sectionGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

const now = new Date();
const dateString = now.toISOString(); // Converts the current date and time to ISO string format

// Append the date string as a parameter
getUrlWithParams.searchParams.append("timestamp", dateString);
// Construct the URL for post branches with query parameters
const postUrlWithParams = new URL(sectionPostAPIURL);
postUrlWithParams.searchParams.append("login_profile", loginProfile);
async function getToken() {
  const user = await getCurrentUser(); // Replace with your method of getting the session
  if (user && user?.access_token) {
    // console.log("access token", user?.access_token);
    return user?.access_token; // Replace 'token' with the actual property name in your session
  }
  // Handle the case where there's no session or token
  throw new Error("No session token available");
}
export async function getSection() {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}/api/school/branch/campus/department/grade/section/?login_profile=${loginProfile}&dropdown=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["section"],
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      // console.log(data.results);
      // Ensure that data.results is always an array
      return Array.isArray(data) ? data : [];
    } else {
      console.error("Error:", response.status, response.statusText);
      return []; // Return an empty array in case of error
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return []; // Return an empty array in case of exception
  }
}

export async function getSectionWithoutGrade(page: number, pageSize: number) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}/api/school/branch/campus/department/grade/section/?login_profile=${loginProfile}&page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["section"],
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      // console.log(data.results);
      // Ensure that data.results is always an array
      return Array.isArray(data?.results) ? data.results : [];
    } else {
      console.error("Error:", response.status, response.statusText);
      return []; // Return an empty array in case of error
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return []; // Return an empty array in case of exception
  }
}
export async function getSectionByGrade(gradeId: any) {
  // console.log(gradeId);
  try {
    const token = await getToken();
    const url = `${sectionGetApiUrl}?login_profile=${loginProfile}&dropdown=true&grade=${gradeId}&dropdown=true`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["section"],
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      // Assuming the API returns an array directly if dropdown=True; adjust if it's wrapped in another property
      return Array.isArray(data) ? data : [];
    } else {
      console.error(
        "Error fetching sections:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export async function getPaginatedSection(
  page: number,
  pageSize: number,
  gradeId: any
) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}/api/school/branch/campus/department/grade/section/?login_profile=${loginProfile}&grade=${gradeId}&page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["section"],
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}




export async function getSectionByGradeYear(gradeId: any, yearId: any) {
  // console.log(gradeId);
  try {
    const token = await getToken();
    const url = `${sectionGetApiUrl}?login_profile=${loginProfile}&grade=${gradeId}&grade__academic_year=${yearId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["section"],
      },
    });

    if (response.ok) {
      const data = await response.json();
      // console.log("Fetched sections:", data.results);
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

export async function postSection(sectionData: any) {
  // console.log("server recieved data", sectionData);
  try {
    const token = await getToken();
    const response = await fetch(postUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(sectionData),
    });
    if (response.ok) {
      const data = await response.json();
      revalidateTag("section");
      return { success: "New Section has been created", data };
    } else {
      const errorResponse = await response.json();
      let errorMessage = "Error creating a new Section"; // Default error message

      // Check for specific backend validation errors related to uniqueness
      if (errorResponse.non_field_errors) {
        // Set a custom error message for unique constraint violations
        errorMessage = "An entry with the given section Name already exists.";
      } else if (typeof errorResponse === "object") {
        // Aggregate all other error messages from the response
        const errorMessages = Object.values(errorResponse).flat().join(", ");
        errorMessage = errorMessages || errorMessage;
      }

      console.error(
        "Error:",
        response.status,
        response.statusText,
        errorMessage
      );
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: "Failed to process request." };
  }
  //   if (response.ok) {
  //     const data = await response.json();
  //     revalidateTag("grade");
  //     return data;
  //   } else {
  //     console.error("Error:", response.status, response.statusText);
  //   }
  // } catch (error) {
  //   console.error("Fetch error:", error);
  // }
}
export async function updateSection(sectionId: any, sectionData: any) {
  // console.log("server received data", sectionData);

  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/section/update/${sectionId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(sectionData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      revalidateTag("section");
      return { success: "Section update successfull", data };
    } else {
      const errorResponse = await response.json();
      let errorMessage = "Error updating a Section"; // Default error message

      // Check for specific backend validation errors related to uniqueness
      if (errorResponse.non_field_errors) {
        // Set a custom error message for unique constraint violations
        errorMessage = "An entry with the given section Name already exists.";
      } else if (typeof errorResponse === "object") {
        // Aggregate all other error messages from the response
        const errorMessages = Object.values(errorResponse).flat().join(", ");
        errorMessage = errorMessages || errorMessage;
      }

      console.error(
        "Error:",
        response.status,
        response.statusText,
        errorMessage
      );
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}


// get selected section based on grades
export async function getSelectedSection(gradeId: any) {
  try {
    const token = await getToken();
    const response = await fetch(`${baseURL}api/school/branch/campus/department/grade/section/?login_profile=${loginProfile}&grade=${gradeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: [`sectionsbygrade${gradeId}`],
      },
    });
    if (response.ok) {
      const data = await response.json();
      // console.log(data.results);
      // Ensure that data.results is always an array
      return Array.isArray(data?.results) ? data.results : [];
    } else {
      console.error("Error:", response.status, response.statusText);
      return []; // Return an empty array in case of error
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return []; // Return an empty array in case of exception
  }
}