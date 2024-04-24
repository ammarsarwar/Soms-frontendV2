"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";

import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const ticketGetApiUrl = `${baseURL}api/attendance/`;

const loginProfile = "PA";

const getUrlWithParams = new URL(ticketGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

async function getToken() {
  const user = await getCurrentUser();
  if (user && user?.access_token) {
    console.log("access token", user?.access_token);
    return user?.access_token;
  }

  throw new Error("No session token available");
}

export async function getAttendance(formattedDate: any, studentID: any) {
  console.log("this is server data", formattedDate, studentID);
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/attendance/?login_profile=${loginProfile}&student=${studentID}&start_date=${formattedDate}&end_date=${formattedDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["attendance"],
        },
      }
    );
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
