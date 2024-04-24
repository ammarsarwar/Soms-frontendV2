"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateBranch } from "../branch/actions";
import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const campusGetApiUrl = `${baseURL}api/school/branch/campus/`;
const campusPostAPIURL = `${baseURL}api/school/branch/campus/create/`;

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzQwNzEwLCJpYXQiOjE3MDMyNTQzMTAsImp0aSI6IjU3YWZhOWJkNjhlMDRiZDBiMWRiN2EyZDA4OGY0NDdkIiwidXNlcl9pZCI6Mn0.6_EXrAyoml8vmULqojpVPRrKTkwoL0NDttoOwp7r_yY";
const loginProfile = "SA";

// Construct the URL for get branches with query parameters
const getUrlWithParams = new URL(campusGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

const now = new Date();
const dateString = now.toISOString(); // Converts the current date and time to ISO string format

// Append the date string as a parameter
getUrlWithParams.searchParams.append("timestamp", dateString);
// Construct the URL for post branches with query parameters
const postUrlWithParams = new URL(campusPostAPIURL);
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
export async function getCampus() {
  try {
    const token = await getToken();
    const response = await fetch(getUrlWithParams.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["campuses"],
      },
    });
    if (response.ok) {
      const data = await response.json();
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

export async function getSelectedCam(branchId: any) {
  // console.log("branch id coming to server:", branchId)
  try {
    const token = await getToken();
    // Constructing the URL with branchId as a query parameter
    const url = new URL(`${baseURL}api/school/branch/campus/`);
    url.searchParams.append("branch", branchId);
    url.searchParams.append("login_profile", loginProfile);

    // Making the fetch request
    const response = await fetch(url, {
      method: "GET",
      next: {
        tags: ['campuses']
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    // const response = await fetch(
    //   `${baseURL}api/school/branch/campus/?login_profile=SA&branch=${branchId}`,
    //   {
    //     method: "GET",
    //     // cache: "no-cache",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("campus data", data.results)
    return data?.results;
  } catch (error) {
    console.error("Error in getSelectedCam:", error);
    return null; // Or handle the error as needed
  }
}

//this function is for users role assign
export async function getSelectedCamForUser(branchId: any) {
  // console.log("branch id coming to server:", branchId)
  try {
    const token = await getToken();

    // Making the fetch request
    const response = await fetch(
      `${baseURL}api/school/branch/campus/?login_profile=${loginProfile}&branch=${branchId}`,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

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



export async function postCampus(campusData: any) {
  console.log("server recieved data", campusData);
  try {
    const token = await getToken();
    const response = await fetch(postUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(campusData),
    });
    if (response.ok) {
      const data = await response.json();
      revalidateTag("campuses");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function updateCampus(
  campusId: any,
  campusData: any,
  branchChanged: boolean = false
) {
  delete campusData["campusId"];
  // console.log("server received data", campusData);
  if (branchChanged) {
    // If branchChanged is true, then update the branch first
    const branchUpdateResult = await updateBranch(campusData);

    if (!branchUpdateResult) {
      console.error("Failed to update the branch");
      return; // Stop the process if branch update fails
    }
  }
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/update/${campusId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(campusData), // Send only the updated campus data
      }
    );

    if (response.ok) {
      const data = await response.json();
      revalidateTag("campuses");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// export async function updateCampusDept(campusId: any) {
//   delete campusData["campusId"];
//   console.log("server received data", campusData);

//   try {
//     const response = await fetch(
//       `${baseURL}api/school/branch/campus/update/${campusId}/`,
//       {
//         headers: {
//           Authorization: `Bearer ${bearerToken}`,
//           "Content-Type": "application/json",
//         },
//         method: "PATCH",
//         body: JSON.stringify(campusData), // Send only the updated campus data
//       }
//     );

//     if (response.ok) {
//       const data = await response.json();
//       revalidateTag("campuses");
//       return data;
//     } else {
//       console.error("Error:", response.status, response.statusText);
//     }
//   } catch (error) {
//     console.error("Fetch error:", error);
//   }
// }

export async function updateCampusDept(campusData: any) {
  const updatedData = {
    ...campusData,
    //  school: 1,
  };
  const { campusId, ...rest } = updatedData;
  // console.log("Server received data for campus update:", rest);

  try {
    const response = await fetch(
      `${baseURL}api/school/branch/campus/update/${campusId}/`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(campusData),
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

