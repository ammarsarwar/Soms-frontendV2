"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";

import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const progressGetApiUrl = `${baseURL}api/progress_tracking/`;
const progressPostAPIURL = `${baseURL}api/progress_tracking/create/`;

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzYyNTU4LCJpYXQiOjE3MDMyNzYxNTgsImp0aSI6IjA1YzczMmZjYWU1NDQ0YTc5NmJmNzg2MmQ3YTQzOTJjIiwidXNlcl9pZCI6Mn0.9YPzDtVK0RPsD09CGwia8p_-cy81ikirWjoBF5R5o3s";
const loginProfile = "PA";

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
export async function getProgress(studentID: any, courseID: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/progress_tracking/?login_profile=${loginProfile}&student=${studentID}&course=${courseID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["progress"],
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
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
