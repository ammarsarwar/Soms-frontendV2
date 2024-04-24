"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
// import { Branch } from "@/components/branchSetup/data/schema";
import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const admissionGetApiUrl = `${baseURL}api/admissions/application/`;

// const updateBranchAPIURL = `${baseURL}api/school/branch/update/`

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzQwNzEwLCJpYXQiOjE3MDMyNTQzMTAsImp0aSI6IjU3YWZhOWJkNjhlMDRiZDBiMWRiN2EyZDA4OGY0NDdkIiwidXNlcl9pZCI6Mn0.6_EXrAyoml8vmULqojpVPRrKTkwoL0NDttoOwp7r_yY";
const loginProfile = "SA";

// Construct the URL for get branches with query parameters
const getUrlWithParams = new URL(admissionGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

async function getToken() {
  const user = await getCurrentUser(); // Replace with your method of getting the session
  if (user && user?.access_token) {
    // console.log("access token", user?.access_token);
    return user?.access_token; // Replace 'token' with the actual property name in your session
  }
  // Handle the case where there's no session or token
  throw new Error("No session token available");
}




export async function getAdmissions() {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/admissions/application/?login_profile=${loginProfile}&dropdown=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["admissions"],
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      // Ensure that data.results is always an array
      // console.log("API response data:", data);
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

export async function getPaginatedAdmissions(page: number, pageSize: number) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/admissions/application/?login_profile=${loginProfile}&page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["admissions"],
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

export async function getAcceptedAdmissions() {
  try {
    const token = await getToken();

    // Construct the URL with the 'status' parameter set to "Accepted"
    const urlWithStatus = new URL(admissionGetApiUrl);
    urlWithStatus.searchParams.append("login_profile", loginProfile);
    urlWithStatus.searchParams.append("status", "Accepted"); // Adding the status filter

    const response = await fetch(urlWithStatus, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["admissions"],
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Ensure that data.results is always an array
      // console.log("API response data:", data);
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

export async function updateAdmissionStatus(admissionId: any, newStatus: any) {
  // console.log("server recieved data", newStatus);
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/admissions/application/update/${admissionId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      // console.log("ststus",data)
      revalidateTag("admissions")
      return data
    } else {
      console.error("Error:", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}
