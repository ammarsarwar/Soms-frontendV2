"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
// import { Branch } from "@/components/branchSetup/data/schema";
import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const branchGetApiUrl = `${baseURL}api/school/branch/`;
const branchPostAPIURL = `${baseURL}api/school/branch/create/`;
// const updateBranchAPIURL = `${baseURL}api/school/branch/update/`

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzQwNzEwLCJpYXQiOjE3MDMyNTQzMTAsImp0aSI6IjU3YWZhOWJkNjhlMDRiZDBiMWRiN2EyZDA4OGY0NDdkIiwidXNlcl9pZCI6Mn0.6_EXrAyoml8vmULqojpVPRrKTkwoL0NDttoOwp7r_yY";
const loginProfile = "SA";

// Construct the URL for get branches with query parameters
const getUrlWithParams = new URL(branchGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

// Construct the URL for post branches with query parameters
const postUrlWithParams = new URL(branchPostAPIURL);
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

export async function getBranches() {
  try {
    const token = await getToken();
    const response = await fetch(getUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["branches"],
      },
    });
    if (response.ok) {
      const data = await response.json();
     
      // console.log("API response data:", data);
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

export async function postBranch(branchData: any) {
  // console.log("server recieved data", branchData);
  try {
    const token = await getToken();
    const response = await fetch(postUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(branchData),
    });
    if (response.ok) {
      const data = await response.json();
      revalidateTag("branches");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function updateBranch(branchData: any) {
  const updatedData = {
    ...branchData,
  };
  const { branchId, ...rest } = updatedData;
  delete updatedData["branchId"];
  // console.log("server recieved data", rest);
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/update/${branchId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(updatedData),
      }
    );
    if (response.ok) {
      const data = await response.json();
      revalidateTag("branches");

      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function editBranch(branchData: any, branchID: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/update/${branchID}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(branchData),
      }
    );
    if (response.ok) {
      const data = await response.json();
      revalidateTag("branches");

      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
