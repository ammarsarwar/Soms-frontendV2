"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateCampusDept } from "../campus/actions";
import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const deptGetApiUrl = `${baseURL}api/school/branch/campus/department/`;
const deptPostAPIURL = `${baseURL}api/school/branch/campus/department/create/`;

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzY4MTAyLCJpYXQiOjE3MDMyODE3MDIsImp0aSI6IjBjNTkyM2RkYzk4MzRiOGU5M2JiN2E0YzA3ZTE3MDJiIiwidXNlcl9pZCI6Mn0.i-Ltz1Pm848ZDlYaXy7p63VCZE_0cGBCwtKyQdgQ2iI";
const loginProfile = "SA";

// Construct the URL for get branches with query parameters
const getUrlWithParams = new URL(deptGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

const now = new Date();
const dateString = now.toISOString(); // Converts the current date and time to ISO string format

// Append the date string as a parameter
getUrlWithParams.searchParams.append("timestamp", dateString);
// Construct the URL for post branches with query parameters
const postUrlWithParams = new URL(deptPostAPIURL);
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
export async function getDept() {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/?login_profile=${loginProfile}&dropdown=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["department"],
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
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

export async function getPaginatedDept(page: number, pageSize: number) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/?login_profile=${loginProfile}&page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["department"],
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data; // Return the whole response to handle pagination metadata outside
    } else {
      console.error("Error:", response.status, response.statusText);
      return null; // Return null to indicate error
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null; // Return null to indicate exception
  }
}

export async function getSelectedDept(campusID: any) {
  try {
    const token = await getToken();
    // Constructing the URL with branchId as a query parameter
    const url = new URL(`${baseURL}api/school/branch/campus/department`);
    url.searchParams.append("campus", campusID);
    url.searchParams.append("login_profile", loginProfile);

    // Making the fetch request
    const response = await fetch(url, {
      method: "GET",
      next: {
        tags: ["department"],
      },
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
    console.error("Error in getSelectedCam:", error);
    return null; // Or handle the error as needed
  }
}

export async function postDept(deptData: any) {
  // console.log("server recieved data", deptData);
  try {
    const token = await getToken();
    const response = await fetch(postUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(deptData),
    });

    if (response.ok) {
      return { success: "Successfully created a new department!" };
    } else {
      const errorResponse = await response.json();
      const errorMessage =
        errorResponse.detail || "Error creating new department";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("department");
  }
}

//  export async function updateDept(deptId: any, deptData: any) {
//    console.log("server received data", deptData);
//    try {
//      const response = await fetch(
//        `${baseURL}api/school/branch/campus/department/update/${deptId}/`,
//        {
//          headers: {
//            Authorization: `Bearer ${bearerToken}`,
//            "Content-Type": "application/json",
//          },
//          method: "PATCH",
//          body: JSON.stringify(deptData), // Send only the updated campus data
//        }
//      );

//      if (response.ok) {
//        const data = await response.json();
//        revalidateTag("department");
//        return data;
//      } else {
//        console.error("Error:", response.status, response.statusText);
//      }
//    } catch (error) {
//      console.error("Fetch error:", error);
//    }
//  }

export async function updateDept(
  deptId: number,
  deptData: any,
  campusChanged: boolean = false
) {
  // console.log("Server received data for department update:", deptData);

  // Check if the campus ID has been changed
  if (campusChanged) {
    const campusUpdateResult = await updateCampusDept(deptData);
    if (!campusUpdateResult) {
      console.error("Failed to update the campus");
      return; // Stop the process if campus update fails
    }
  }

  // Continue with department update
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/update/${deptId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(deptData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      revalidateTag("department");
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

export async function updateDeptGrade(deptData: any) {
  const updatedData = {
    ...deptData,
    //  school: 1,
  };
  const { deptId, ...rest } = updatedData;
  // console.log("Server received data for campus update:", rest);

  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/update/${deptId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(deptData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      revalidateTag("campuses");
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