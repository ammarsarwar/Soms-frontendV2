"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";

import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const studentGetApiUrl = `${baseURL}api/admissions/student_profile/`;

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzYyNTU4LCJpYXQiOjE3MDMyNzYxNTgsImp0aSI6IjA1YzczMmZjYWU1NDQ0YTc5NmJmNzg2MmQ3YTQzOTJjIiwidXNlcl9pZCI6Mn0.9YPzDtVK0RPsD09CGwia8p_-cy81ikirWjoBF5R5o3s";
const loginProfile = "TE";

// Construct the URL for get branches with query parameters
const getUrlWithParams = new URL(studentGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

const now = new Date();
const dateString = now.toISOString(); // Converts the current date and time to ISO string format

// Append the date string as a parameter
getUrlWithParams.searchParams.append("timestamp", dateString);
// Construct the URL for post branches with query parameters

async function getToken() {
  const user = await getCurrentUser(); // Replace with your method of getting the session
  if (user && user?.access_token) {
    // console.log("access token", user?.access_token);
    return user?.access_token; // Replace 'token' with the actual property name in your session
  }
  // Handle the case where there's no session or token
  throw new Error("No session token available");
}

export async function getStudents() {
  try {
    const token = await getToken();
    const url = `${studentGetApiUrl}?login_profile=${loginProfile}&status=Active`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
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

export async function getStudentByStatus() {
  try {
    const token = await getToken();
    const url = `${studentGetApiUrl}?login_profile=${loginProfile}&status=Unassigned Section`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
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
export async function updateStudent(studentId: any, sectionData: any) {
  // console.log("server received data", sectionData, studentId);

  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/admissions/student_profile/update/${studentId}/`,
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
      revalidateTag("grade");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function getStudentById(studentId: any) {
  try {
    const token = await getToken();
    const url = `${studentGetApiUrl}/${studentId}/`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      // console.log("Fetched student:", data);
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

export async function getStudentBySection(sectionId: any) {
  try {
    const token = await getToken();
    const url = `${studentGetApiUrl}?login_profile=${loginProfile}&section=${sectionId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      // console.log("Fetched student:", data);
      return data.results;
    } else {
      console.error("Error:", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}



