"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
// import { Branch } from "@/components/branchSetup/data/schema";
import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const admCalendarGetApiUrl = `${baseURL}api/admissions/calendar/`;

// const updateBranchAPIURL = `${baseURL}api/school/branch/update/`

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzQwNzEwLCJpYXQiOjE3MDMyNTQzMTAsImp0aSI6IjU3YWZhOWJkNjhlMDRiZDBiMWRiN2EyZDA4OGY0NDdkIiwidXNlcl9pZCI6Mn0.6_EXrAyoml8vmULqojpVPRrKTkwoL0NDttoOwp7r_yY";
const loginProfile = "SA";

// Construct the URL for get branches with query parameters
const getUrlWithParams = new URL(admCalendarGetApiUrl);
// getUrlWithParams.searchParams.append("status", "Open");
// getUrlWithParams.searchParams.append("login_profile", loginProfile);

async function getToken() {
  const user = await getCurrentUser();
  if (user && user?.access_token) {
    // console.log("access token", user?.access_token);
    return user?.access_token;
  }
  // Handle the case where there's no session or token
  throw new Error("No session token available");
}

export async function getCalendar() {
  try {
    const token = await getToken();
    const response = await fetch(getUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["calendar"],
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

