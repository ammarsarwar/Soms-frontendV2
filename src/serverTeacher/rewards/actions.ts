"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const rewardsGetApiUrl = `${baseURL}api/rewards/`;
const rewardsPostAPIURL = `${baseURL}api/rewards/create/`;

const skillsGetApiUrl = `${baseURL}api/rewards/skill/`;
const skillsPostApiUrl = `${baseURL}api/rewards/skill/create/`;

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzYyNTU4LCJpYXQiOjE3MDMyNzYxNTgsImp0aSI6IjA1YzczMmZjYWU1NDQ0YTc5NmJmNzg2MmQ3YTQzOTJjIiwidXNlcl9pZCI6Mn0.9YPzDtVK0RPsD09CGwia8p_-cy81ikirWjoBF5R5o3s";
const loginProfile = "TE";

// Construct the URL for get branches with query parameters
const getUrlWithParams = new URL(rewardsGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

const getSkillUrlWithParams = new URL(skillsGetApiUrl);
getSkillUrlWithParams.searchParams.append("login_profile", loginProfile);

const now = new Date();
const dateString = now.toISOString(); // Converts the current date and time to ISO string format

// Append the date string as a parameter
getUrlWithParams.searchParams.append("timestamp", dateString);
// Construct the URL for post branches with query parameters
const postUrlWithParams = new URL(rewardsPostAPIURL);
postUrlWithParams.searchParams.append("login_profile", loginProfile);

const postSkillURLwithParams = new URL(skillsPostApiUrl);
postSkillURLwithParams.searchParams.append("login_profile", loginProfile);

async function getToken() {
  const user = await getCurrentUser(); // Replace with your method of getting the session
  if (user && user?.access_token) {
    console.log("access token", user?.access_token);
    return user?.access_token; // Replace 'token' with the actual property name in your session
  }
  // Handle the case where there's no session or token
  throw new Error("No session token available");
}
export async function getRewards() {
  try {
    const token = await getToken();
    const response = await fetch(getUrlWithParams.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["grade"],
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
export async function getRewardsById(rewardId: any) {
  console.log(rewardId);
  try {
    const token = await getToken();
    const url = `${baseURL}api/rewards/${rewardId}/?login_profile=TE`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched rewards:", data.results);
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

export async function getRewardsByCourse(courseId: any) {
  console.log(courseId);
  try {
    const token = await getToken();
    const url = `${getUrlWithParams}&course=${Number(courseId)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched rewards:", data.results);
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

export async function getStudentRewardByCourse(courseId: any) {
  console.log(courseId);
  try {
    const token = await getToken();
    const url = new URL(`${baseURL}api/rewards/optimized_list/`);
    url.searchParams.append("login_profile", loginProfile);
    url.searchParams.append("course", courseId.toString());

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched rewards:", data.results);
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

export async function postRewards(rewardsData: any) {
  console.log("for post request", rewardsData);
  try {
    const token = await getToken();
    const response = await fetch(postUrlWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(rewardsData),
    });
    if (response.ok) {
      const data = await response.json();
      revalidateTag("rewards");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
export async function addSkillRewards(addSkillData: any) {
  console.log("for add skill reward request", addSkillData);

  try {
    const token = await getToken();

    const response = await fetch(`${baseURL}api/rewards/add_skills/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(addSkillData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Updated Reward Data:", data); // Log the received updated data
      revalidateTag("rewards");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// skills apis

export async function getSkills() {
  try {
    const token = await getToken();
    const response = await fetch(getSkillUrlWithParams.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
      next: {
        tags: ["grade"],
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

export async function postSkills(skillsData: FormData) {
  console.log("server received data", skillsData);
  try {
    const token = await getToken();
    const response = await fetch(postSkillURLwithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: skillsData,
    });

    if (response.ok) {
      const data = await response.json();
      revalidateTag("skils");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function getSkillsByReward(rewardId: any) {
  console.log(rewardId);
  try {
    const token = await getToken();
    const url = `${getSkillUrlWithParams}&rewards=${Number(rewardId)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched skills:", data.results);
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

export async function resetReward(resetData: any) {
  console.log(resetData);
  try {
    const token = await getToken();
    const url = new URL(`${baseURL}api/rewards/reset/`);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(resetData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched skills:", data.results);
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
