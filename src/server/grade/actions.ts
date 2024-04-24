"use server";
// import axios from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateDeptGrade } from "../department/actions";
import { revalidateTag } from "next/cache";

const baseURL = process.env.BACKEND_URL;

// list of api urls for branch setup
const gradeGetApiUrl = `${baseURL}api/school/branch/campus/department/grade/`;
const gradePostAPIURL = `${baseURL}api/school/branch/campus/department/grade/create/`;

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAzMzYyNTU4LCJpYXQiOjE3MDMyNzYxNTgsImp0aSI6IjA1YzczMmZjYWU1NDQ0YTc5NmJmNzg2MmQ3YTQzOTJjIiwidXNlcl9pZCI6Mn0.9YPzDtVK0RPsD09CGwia8p_-cy81ikirWjoBF5R5o3s";
const loginProfile = "SA";

// Construct the URL for get branches with query parameters
const getUrlWithParams = new URL(gradeGetApiUrl);
getUrlWithParams.searchParams.append("login_profile", loginProfile);

const now = new Date();
const dateString = now.toISOString(); // Converts the current date and time to ISO string format

// Append the date string as a parameter
getUrlWithParams.searchParams.append("timestamp", dateString);
// Construct the URL for post branches with query parameters
const postUrlWithParams = new URL(gradePostAPIURL);
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
export async function getGrade() {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/?login_profile=${loginProfile}&dropdown=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["grade"],
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      // console.log(data.results)
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


export async function getGradeBySearch(searchParam: any) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/?login_profile=${loginProfile}&search=${searchParam}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["grade"],
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      // console.log(data.results)
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

export async function getPaginatedGrade(page: number, pageSize: number) {
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/?login_profile=${loginProfile}&page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["grade"],
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data; // Return the whole response to handle pagination metadata outside
    } else {
      console.error("Error:", response.status, response.statusText);
      return null; // Return null to indicate error
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null; // Return null to indicate exception
  }
}

export async function postGrade(gradeData: any) {
  console.log("server received data", gradeData);

  try {
    const token = await getToken();
    const response = await fetch(postUrlWithParams, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gradeData),
    });

    if (response.ok) {
      const data = await response.json();
      revalidateTag("grade");
      return { success: "New grade has been created", data };
    } else {
      const errorResponse = await response.json();
      let errorMessage = "Error creating a new grade"; // Default error message

      // Check for specific backend validation errors related to uniqueness
      if (errorResponse.non_field_errors) {
        // Set a custom error message for unique constraint violations
        errorMessage =
          "An entry with the given Grade Name, Department, and Academic Year already exists. Please use a different combination.";
      } else if (typeof errorResponse === "object") {
        // Aggregate all other error messages from the response
        const errorMessages = Object.values(errorResponse).flat().join(", ");
        errorMessage = errorMessages || errorMessage;
      }

      console.error(
        "Error:",
        response.status,
        response.statusText,
        errorMessage
      );
      return { error: errorMessage };
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: "Failed to process request." };
  }
}





// export async function postGrade(gradeData: any) {
//   console.log("server recieved data", gradeData);
//   try {
//     const token = await getToken();
//     const response = await fetch(postUrlWithParams, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body: JSON.stringify(gradeData),
//     });
//     if (response.ok) {
//       const data = await response.json();
//       revalidateTag("grade");
//       return data;
//     } else {
//       console.error("Error:", response.status, response.statusText);
//     }
//   } catch (error) {
//     console.error("Fetch error:", error);
//   }
// }

export async function updateGrade(
  gradeId: any,
  gradeData: any,
  deptChanged: boolean = false
) {
  // console.log("server received data", gradeData);
  if (deptChanged) {
    const campusUpdateResult = await updateDeptGrade(gradeData);
    if (!campusUpdateResult) {
      console.error("Failed to update the campus");
      return; // Stop the process if campus update fails
    }
  }
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/school/branch/campus/department/grade/update/${gradeId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(gradeData),
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


export async function getSelectedGrade(deptID: any) {
  try {
    const token = await getToken();
    // Constructing the URL with branchId as a query parameter
    const url = new URL(`${baseURL}api/school/branch/campus/department/grade/?login_profile=${loginProfile}&department=${deptID}`);
   

    // Making the fetch request
    const response = await fetch(url, {
      method: "GET",
      next: {
        tags: [`selectedGradebydepartment${deptID}`],
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      return []
    }

    const data = await response.json();
    return data?.results;
  } catch (error) {
    console.error("Error in getSelectedDept:", error);
    return []; // Or handle the error as needed
  }
}
export async function getSelectedGradeByYearCampus(campusID: any, yearID: any) {
  try {
    const token = await getToken();
    // Constructing the URL with branchId as a query parameter
    const url = new URL(
      `${baseURL}api/school/branch/campus/department/grade/?login_profile=${loginProfile}&department__campus=${campusID}&academic_year=${yearID}`
    );

    // Making the fetch request
    const response = await fetch(url, {
      method: "GET",
      next: {
        tags: [`selectedGradebydepartment${campusID}`],
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data?.results;
  } catch (error) {
    console.error("Error in getSelectedDept:", error);
    return []; // Or handle the error as needed
  }
}
export async function getSelectedGradeByYear(deptID: any, yearID: any) {
  try {
    const token = await getToken();
    // Constructing the URL with branchId as a query parameter
    const url = new URL(
      `${baseURL}api/school/branch/campus/department/grade/?login_profile=${loginProfile}&department=${deptID}&academic_year=${yearID}`
    );

    // Making the fetch request
    const response = await fetch(url, {
      method: "GET",
      next: {
        tags: [`selectedGradebydepartment${deptID}`],
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data?.results;
  } catch (error) {
    console.error("Error in getSelectedDept:", error);
    return []; // Or handle the error as needed
  }
}
export async function getGradeByCampus(campusId: any) {
  try {
    const token = await getToken();
    // Constructing the URL with branchId as a query parameter
    const url = new URL(
      `${baseURL}api/school/branch/campus/department/grade/?login_profile=${loginProfile}&department__campus=${campusId}`
    );

    // Making the fetch request
    const response = await fetch(url, {
      method: "GET",
      next: {
        tags: ["grade"],
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.results;
  } catch (error) {
    console.error("Error in getSelectedDept:", error);
    return null; // Or handle the error as needed
  }
}