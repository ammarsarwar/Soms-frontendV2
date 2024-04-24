"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateDeptGrade } from "../department/actions";
import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const ticketGetApiUrl = `${baseURL}api/tickets/`;
const ticketPostAPIURL = `${baseURL}api/tickets/create/`;

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzYyNTU4LCJpYXQiOjE3MDMyNzYxNTgsImp0aSI6IjA1YzczMmZjYWU1NDQ0YTc5NmJmNzg2MmQ3YTQzOTJjIiwidXNlcl9pZCI6Mn0.9YPzDtVK0RPsD09CGwia8p_-cy81ikirWjoBF5R5o3s";
const loginProfile = "SA";

// Construct the URL for get branches with query parameters
const getUrlWithParams = new URL(ticketGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

const now = new Date();
const dateString = now.toISOString(); // Converts the current date and time to ISO string format

// Append the date string as a parameter
getUrlWithParams.searchParams.append("timestamp", dateString);
// Construct the URL for post branches with query parameters
const postUrlWithParams = new URL(ticketPostAPIURL);
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

export async function getTicket() {
  try {
    const token = await getToken();
    const response = await fetch(getUrlWithParams.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["ticket"],
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

export async function getOneticket(ticketId: any) {
  try {
    const token = await getToken();
    const url = new URL(`${baseURL}api/tickets/${ticketId}/`);

    const response = await fetch(
      `${baseURL}api/tickets/${ticketId}/?login_profile=${loginProfile}`,
      {
        method: "GET",
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
    return data;
  } catch (error) {
    console.error("Error in getProgressByPage:", error);
    return [];
  }
}

export async function postTicket(ticketData: any) {
  console.log("server recieved data", ticketData);
  try {
    const token = await getToken();
    const response = await fetch(postUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(ticketData),
    });
    if (response.ok) {
      const data = await response.json();
      revalidateTag("ticket");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function updateTicketStatus(ticketId: any, newStatus: any) {
  console.log("server recieved data", newStatus);
  console.log("ticket id", ticketId);

  try {
    const token = await getToken();
    const response = await fetch(`${baseURL}api/tickets/update/${ticketId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    if (response.ok) {
      const data = await response.json();
      revalidateTag("ticket");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function postResponse(responseData: any) {
  console.log("server recieved data", responseData);
  try {
    const token = await getToken();
    const response = await fetch(`${baseURL}api/tickets/response/create/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(responseData),
    });
    if (response.ok) {
      const data = await response.json();
      revalidateTag("ticket");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function assignTicket(userId: any, ticketId: any) {
  console.log("server recieved data", userId);
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/tickets/forward_ticket/${ticketId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(userId),
      }
    );
    if (response.ok) {
      const data = await response.json();
      revalidateTag("ticket");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
