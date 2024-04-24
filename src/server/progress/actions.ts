"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateDeptGrade } from "../department/actions";
import { revalidateTag } from "next/cache";
import { BulkProgressSchema, TBulkProgressSchema } from "@/schemas";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const progressGetApiUrl = `${baseURL}api/progress_tracking/`;
const progressPostAPIURL = `${baseURL}api/progress_tracking/create/`;

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzYyNTU4LCJpYXQiOjE3MDMyNzYxNTgsImp0aSI6IjA1YzczMmZjYWU1NDQ0YTc5NmJmNzg2MmQ3YTQzOTJjIiwidXNlcl9pZCI6Mn0.9YPzDtVK0RPsD09CGwia8p_-cy81ikirWjoBF5R5o3s";
const loginProfile = "SA";

// Construct the URL for get branches with query parameters
const getUrlWithParams = new URL(progressGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

const now = new Date();
const dateString = now.toISOString(); // Converts the current date and time to ISO string format

// Append the date string as a parameter
getUrlWithParams.searchParams.append("timestamp", dateString);
// Construct the URL for post branches with query parameters
const postUrlWithParams = new URL(progressPostAPIURL);
postUrlWithParams.searchParams.append("login_profile", loginProfile);

async function getToken() {
  const user = await getCurrentUser(); // Replace with your method of getting the session
  if (user && user?.access_token) {
    console.log("access token", user?.access_token);
    return user?.access_token; // Replace 'token' with the actual property name in your session
  }
  // Handle the case where there's no session or token
  throw new Error("No session token available");
}
export async function getProgress() {
  try {
    const token = await getToken();
    const response = await fetch(getUrlWithParams.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["progress"],
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data.results);
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

// export async function getRewardsByCourse(courseId: any) {
//   console.log(courseId);
//   try {
//     const token = await getToken();
//     const url = `${getUrlWithParams}&course=${Number(courseId)}`;

//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       method: "GET",
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log("Fetched rewards:", data.results);
//       return Array.isArray(data?.results) ? data.results : [];
//     } else {
//       console.error("Error:", response.status, response.statusText);
//       return [];
//     }
//   } catch (error) {
//     console.error("Fetch error:", error);
//     return [];
//   }
// }

export async function postProgress(progressData: any) {
  const validatedValues = BulkProgressSchema.safeParse(progressData);
    if (!validatedValues.success) {
      return { error: "Invalid fields!" };
    }
    const token = await getToken();
    if (!token) {
      return { error: "No session found, Please login again!" };
    }
  try {
    const response = await fetch(progressPostAPIURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(validatedValues.data),
    });

    if (response.ok) {
      return { success: "Successfully student progressfor this week" };
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.detail || "Error marking student progress";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("progress");
  }
}

export async function getProgressByStudent(studentId: any) {
  try {
    const token = await getToken();
    // Constructing the URL with branchId as a query parameter
    const url = new URL(
      `${baseURL}api/progress_tracking/?login_profile=${loginProfile}&student=${studentId}&dropdown=true`
    );

    // Making the fetch request
    const response = await fetch(url, {
      method: "GET",
      next: {
        tags: [`progress${studentId}`],
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "Error in API request:",
        response.status,
        response.statusText
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response Data:", data); // Log the API response
    return data;
  } catch (error) {
    console.error("Error in getProgressByStudent:", error);
    return []; // Or handle the error as needed
  }
}

export async function getProgressByPage(studentId: any, page: number) {
  try {
    const token = await getToken();
    const url = new URL(`${baseURL}api/progress_tracking/`);
    url.searchParams.append("login_profile", loginProfile);
    url.searchParams.append("student", studentId);
    url.searchParams.append("page", page.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.results;
  } catch (error) {
    console.error("Error in getProgressByPage:", error);
    return [];
  }
}

export async function updateMarkedProgress(progressData: any, progressId: any) {
  console.log("update server received data", progressData);

  console.log("server received data", progressId);
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/progress_tracking/update/${progressId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(progressData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
      return undefined
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return undefined
  } finally {
    revalidateTag("progress");
  }
}