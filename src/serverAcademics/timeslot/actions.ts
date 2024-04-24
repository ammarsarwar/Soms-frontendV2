"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
// import { Branch } from "@/components/branchSetup/data/schema";
import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const timeSlotGetApiUrl = `${baseURL}api/admissions/test_slot/`;
const timeSlotAPIURL = `${baseURL}api/admissions/test_slot/create/`;
// const updateBranchAPIURL = `${baseURL}api/school/branch/update/`

const admissionCalendarGetApiURL = `${baseURL}api/admissions/calendar/`;

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzQwNzEwLCJpYXQiOjE3MDMyNTQzMTAsImp0aSI6IjU3YWZhOWJkNjhlMDRiZDBiMWRiN2EyZDA4OGY0NDdkIiwidXNlcl9pZCI6Mn0.6_EXrAyoml8vmULqojpVPRrKTkwoL0NDttoOwp7r_yY";
const loginProfile = "AC";
const dropdown = "true";
const getAdmUrlWithParams = new URL(admissionCalendarGetApiURL);

// Construct the URL for get branches with query parameters
const getUrlWithParams = new URL(timeSlotGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

// Construct the URL for post branches with query parameters
const postUrlWithParams = new URL(timeSlotAPIURL);
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

export async function getTimeSlots() {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/admissions/test_slot/?login_profile=AC`,
      {
        method: "GET",

        next: {
          tags: ["timeslots"],
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();

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

export async function postTimeSlot(slotData: any) {
  console.log("Posting data", slotData);

  try {
    const token = await getToken();
    const response = await fetch(postUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(slotData),
    });

    // console.log("Response Status:", response.status);

    if (response.ok) {
      // Check if the response has content
      const data = await response.json();
      revalidateTag("timeslots");
      return data;
    } else {
      // Handle non-OK responses
      console.error(
        "Error in POST request:",
        response.status,
        response.statusText
      );
      return undefined;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return undefined;
  }
}

export async function getAdmissionCalendar() {
  try {
    const token = await getToken();
    const response = await fetch(getAdmUrlWithParams, {
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
