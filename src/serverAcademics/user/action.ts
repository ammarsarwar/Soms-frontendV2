"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
// import { Branch } from "@/components/branchSetup/data/schema";
import { revalidateTag } from "next/cache";
import { toast } from "sonner";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const userGetApiUrl = `${baseURL}api/user/`;
const userPostAPIURL = `${baseURL}api/user/registerStaff/`;
const userUpdateAPIURL = `${baseURL}api/user/registertaff/update/`;
const profilePostApiUrl = `${baseURL}api/user/profile/create/`;
const searchUserGetApiUrl = `${baseURL}api/user/`;
const teacherGetApiUrl = `${baseURL}api/user/profile/`;

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzNDA3MTg3LCJpYXQiOjE3MDMzMjA3ODcsImp0aSI6ImZhNTk4ZjBjMDI1YTRhMzE5MDA4MjRjNzQwMTVjOGZjIiwidXNlcl9pZCI6Mn0.adRsN823hr5FBFkdikHAS0gEkUC14akC1qqk4UkMSRw";
const loginProfile = "AC";

// Construct the URL for get branches with query parameters
const getTeacherURLWithParams = new URL(teacherGetApiUrl);
getTeacherURLWithParams.searchParams.append("login_profile", loginProfile);
getTeacherURLWithParams.searchParams.append("userRole", "TE");

const getUrlWithParams = new URL(userGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

// Construct the URL for post branches with query parameters
const postUrlWithParams = new URL(userPostAPIURL);
postUrlWithParams.searchParams.append("login_profile", loginProfile);

const updateURLWithParams = new URL(userUpdateAPIURL);
updateURLWithParams.searchParams.append("login_profile", loginProfile);

// Construct the URL for post branches with query parameters
const profileUrlWithParams = new URL(profilePostApiUrl);
profileUrlWithParams.searchParams.append("login_profile", loginProfile);

async function getToken() {
  const user = await getCurrentUser(); // Replace with your method of getting the session
  if (user && user?.access_token) {
    // console.log("access token", user?.access_token);
    return user?.access_token; // Replace 'token' with the actual property name in your session
  }
  // Handle the case where there's no session or token
  throw new Error("No session token available");
}

export async function getUsers() {
  try {
    const token = await getToken();
    const response = await fetch(getUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["users"],
      },
    });
    if (response.ok) {
      const data = await response.json();
      //  console.log(data.results)
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
export async function getTeacherUsers() {
  try {
    const token = await getToken();
    const urlWithParams = new URL(teacherGetApiUrl);
    urlWithParams.searchParams.append("login_profile", loginProfile);
    urlWithParams.searchParams.append("userRole", "TE");

    const response = await fetch(urlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });
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

export async function postUser(userData: any) {
  delete userData.confirm_password;
  // console.log(userData);
  try {
    const token = await getToken();
    const response = await fetch(postUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(userData),
    });
    const resStatus = response.status;
    // console.log(resStatus);
    if (response.ok) {
      const data = await response.json();
      revalidateTag("users");
      return resStatus;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function updateUser(userData: any, user: any) {
  // console.log("server recieved data", userData, user.id);
  const userId = user.id;
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/user/update/${userId}/?login_profile=SA`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(userData),
      }
    );
    const resStatus = response.status;
    // console.log("mystatus", resStatus);
    if (response.ok) {
      const data = await response.json();
      revalidateTag("users");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function postProfile(userData: any) {
  // console.log("server recieved data", userData);
  try {
    const token = await getToken();
    const response = await fetch(postUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(userData),
    });
    const resStatus = response.status;
    // console.log(resStatus);
    if (response.ok) {
      // const data = await response.json();
      revalidateTag("users");
      return response.status;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function postAssignProfile(userData: any) {
  const refinedData = {
    ...userData,
    campus: Number(userData.campus),
    branch: Number(userData.branch),
    school: 1,
  };
  // console.log("server recieved data", refinedData);
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/user/profile/create/?login_profile=SA`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(refinedData),
      }
    );
    if (response.ok) {
      const data = await response.json();
      revalidateTag("users");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function searchUserDetails(userName: any) {
  // console.log("server recieved data", userName);

  // Construct the URL for post branches with query parameters
  const searchUrlWithParams = new URL(searchUserGetApiUrl);
  searchUrlWithParams.searchParams.append("login_profile", loginProfile);
  searchUrlWithParams.searchParams.append("search", userName.email);

  try {
    const token = await getToken();
    const response = await fetch(searchUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["search"],
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

export async function deleteUser(userId: any) {
  const userDeleteAPIURL = `${baseURL}api/user/profile/update/${userId}/`;
  // Construct the URL for post branches with query parameters
  const deleteUrlWithParams = new URL(userDeleteAPIURL);
  deleteUrlWithParams.searchParams.append("login_profile", loginProfile);
  // console.log("server recieved data", branchData)
  try {
    const token = await getToken();
    const response = await fetch(deleteUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
      // body: JSON.stringify(branchData)
    });
    if (response.ok) {
      const data = await response.json();
      revalidateTag("users");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function postBulkCreateUsers(bulkUserData: any) {
  // console.log("file", bulkUserData)
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/user/registerStaff_bulk/?login_profile=${loginProfile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(bulkUserData),
      }
    );
    const data = await response.json();
    if (response.ok) {
      revalidateTag("users");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
      return undefined;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return undefined;
  }
}
