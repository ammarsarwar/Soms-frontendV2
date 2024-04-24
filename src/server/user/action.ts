"use server";
import { authOptions } from "@/lib/auth";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
import {  ProfileDataSchema, ProfileDetailsSchema, StudentTransferSchema, TProfileDataSchema, TStudentTransferSchema, TUserSchema, TUserStatusChangeSchema, UserFormSchema, UserSchema, UserStatusChangeSchema, ZTUserFormSchema, ZUserFormSchema } from "@/schemas";
import { getServerSession } from "next-auth";
// import { Branch } from "@/components/branchSetup/data/schema";
import { revalidateTag } from "next/cache";
import { toast } from "sonner";
import { z } from "zod";

const baseURL = process.env.BACKEND_URL;
const loginProfile = "SA";

// list of api urls for branch setup
const userPostAPIURL = `${baseURL}api/user/registerStaff/`;
const userUpdateAPIURL = `${baseURL}api/user/registertaff/update/`;
const profilePostApiUrl = `${baseURL}api/user/profile/create/`;
const searchUserGetApiUrl = `${baseURL}api/user/`;
const teacherGetApiUrl = `${baseURL}api/user/profile/`;


// Construct the URL for get branches with query parameters
const getTeacherURLWithParams = new URL(teacherGetApiUrl);
getTeacherURLWithParams.searchParams.append("login_profile", loginProfile);
getTeacherURLWithParams.searchParams.append("userRole", "TE");

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
    const response = await fetch(
      `${baseURL}api/user/?login_profile=${loginProfile}&dropdown=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["users"],
        },
      }
    );
    const data = await response.json();
    console.log(data)
    if (response.ok) {
      const validatedData = z.array(UserSchema).safeParse(data);
      if (!validatedData.success) {
        console.log(validatedData.error.issues[0].path);
        console.error(
          "Get Users error: data on the based is changed or inconsistent please check your data and the schema",
          validatedData.error
        );
        return [];
      }
      return validatedData.data;
    } else {
      console.error("Error:", response.status, response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return []; 
  }
}


export async function getProfileDetails(profileId: number) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/user/profile/${profileId}/?login_profile=${loginProfile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["profileDetails"],
        },
      }
    );
    const data = await response.json();
    // console.log(data)
    if (response.ok) {
      const validatedData = ProfileDetailsSchema.safeParse(data);
      if (!validatedData.success) {
        // console.log(validatedData.error.issues[0].path);
        console.error(
          "Get Users error: data on the based is changed or inconsistent please check your data and the schema",
          validatedData.error
        );
        return {error: "Error getting profile details", data: null}
      }
      return {success: "OK", data: validatedData.data}
    } else {
      console.error("Error:", response.status, response.statusText);
      return {error: "Error getting profile details", data: null}
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return {error: "Error getting profile details", data: null} 
  }
}

export async function getNurseUsers(nurseCampus: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/user/profile_detail_list/?login_profile=${loginProfile}&userRole=NU&campus=${nurseCampus}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["users"],
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.results;
  } catch (error) {
    console.error("Error in nurse select:", error);
    return null; // Or handle the error as needed
  }
}




export async function getTeacherUsers(campusId: any) {
  try {
    const token = await getToken();
    const urlWithParams = new URL(teacherGetApiUrl);
    urlWithParams.searchParams.append("login_profile", loginProfile);
    urlWithParams.searchParams.append("userRole", "TE");
    urlWithParams.searchParams.append("campus", campusId);

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

export async function postUser(userData: ZTUserFormSchema) {

  const validatedValues = ZUserFormSchema.safeParse(userData);
  if (!validatedValues.success) {
    return { error: "Invalid fields!" };
  }
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  try {
    const response = await fetch(`${baseURL}api/user/registerStaff/?login_profile=${loginProfile}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedValues.data),
    });
    if (response.ok) {
      return { success: "Successfully created a new user!" };
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.detail || "Error creating new user";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("users");
  }
}


export async function updateUser(userData: UserFormSchema, user: TUserSchema) {
  const validatedUserValues = ZUserFormSchema.safeParse(userData);
  if (!validatedUserValues.success) {
    return { error: "Invalid fields!" };
  }

  const validatedProfileValues = UserSchema.safeParse(user);
  if (!validatedProfileValues.success) {
    return { error: "Invalid fields!" };
  }

  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }

  const userId = validatedProfileValues.data.id
  try {
    const response = await fetch(
      `${baseURL}api/user/update/${userId}/?login_profile=${loginProfile}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(userData),
      }
    );
    if (response.ok) {
      return { success: "Successfully updated user data!" };
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.detail || "Error updating user data";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("users");
  }
}


export async function postAssignProfile(userData: TProfileDataSchema, user: TUserSchema) {
  const validatedProfileValues = ProfileDataSchema.safeParse(userData);
  if (!validatedProfileValues.success) {
    return { error: "Invalid fields!" };
  }

  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  const refinedData = {
    ...validatedProfileValues.data,
    campus: Number(validatedProfileValues.data.campus),
    branch: Number(validatedProfileValues.data.branch),
    user: user.id
  };
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
      return { success: "Successfully assigned role to this user!" };
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.detail || "Error assigning user role";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("users");
  }
}

export const updateAssignProfile = async (profileData: TProfileDataSchema, ProfileId: number | null) => {
  if(ProfileId === null) {
    return { error: "Can't find user profile"}
  }
  const validatedProfileValues = ProfileDataSchema.safeParse(profileData);
  if (!validatedProfileValues.success) {
    return { error: "Invalid fields!" };
  }

  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/user/profile/update/${ProfileId}/?login_profile=SA`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(profileData),
      }
    );
    if (response.ok) {
      return { success: "Successfully updated user profile" };
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.detail || "Error updating user profile";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("users");
  }
} 


export async function postBulkCreateUsers(bulkUserData: ZTUserFormSchema[]) {
  console.log(bulkUserData)
  const validatedValues = z.array(ZUserFormSchema).safeParse(bulkUserData);
  if (!validatedValues.success) {
    return { error: "Invalid fields!" };
  }
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  try {
    const response = await fetch(`${baseURL}api/user/registerStaff_bulk/?login_profile=${loginProfile}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedValues.data),
    });
    if (response.ok) {
      return { success: "Successfully imported all the users from file!" };
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.detail || "Error importing new users";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("users");
  }
}


export async function postBulkCreateStudents(bulkStudentData: TStudentTransferSchema[], sectionId: number) {
  console.log(bulkStudentData)
  const validatedValues = z.array(StudentTransferSchema).safeParse(bulkStudentData);
  if (!validatedValues.success) {
    return { error: "Invalid fields!" };
  }
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  const refinedData = {
    section: sectionId,
    student_list: validatedValues.data
  }
  try {
    const response = await fetch(`${baseURL}api/admissions/mid_term_transfer/?login_profile=${loginProfile}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refinedData),
    });
    if (response.ok) {
      return { success: "Successfully imported all the students from file!" };
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.detail || "Error importing new students";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("students");
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



export async function postProfile(userData: any) {
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

 export const updateUserStatusChange = async (userData: TUserStatusChangeSchema) => {
  const validatedValues = UserStatusChangeSchema.safeParse(userData);
  if (!validatedValues.success) {
    return { error: "Invalid fields!" };
  }
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  const {status, user_id} = validatedValues.data
  const refinedData = {
    status,
  }
  console.log(refinedData)
  try {
    const response = await fetch(`${baseURL}api/user/update/${user_id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refinedData),
    });
    if (response.ok) {
      return { success: "Successfully updated the status of this user" };
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.detail || "Error updating the status of this user";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("users");
  }
 }

 export async function deleteUserRole(profileId: number) {
  const validatedValues = z.number().safeParse(profileId);
  if (!validatedValues.success) {
    return { error: "Invalid fields!" };
  }
  const token = await getToken();
  if (!token) {
    return { error: "No session found, Please login again!" };
  }
  try {
    const response = await fetch(`${baseURL}api/user/profile/delete/${profileId}/?login_profile=${loginProfile}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
      // body: JSON.stringify(branchData)
    });
    if (response.ok) {
      return { success: "Successfully deleted user role" };
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.detail || "Error deleting user roles";
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Server request failed:", error);
    return { error: "Failed to process request." };
  } finally {
    revalidateTag("users");
  }
}