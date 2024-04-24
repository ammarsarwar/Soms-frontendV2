"use server";

import { getCurrentUser } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const baseURL = process.env.BACKEND_URL;
const login_profile = "PA";

async function getToken() {
  const user = await getCurrentUser();
  if (user && user?.access_token) {
    return user?.access_token;
  }
  throw new Error("No session token available");
}

interface GradingDataProps {
  course: number | undefined;
}

export async function getDismissalRequests(formattedDate: any) {
  console.log(formattedDate);
  try {
    const token = await getToken();
    const response = await fetch(
      `${baseURL}api/dismissal/?login_profile=${login_profile}&dismissal_date=${formattedDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: [`dismissals`],
        },
      }
    );
    // let zodLessonErrors = {}
    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data.results) ? data.results : [];
    } else {
      console.error(
        "dismissal Get Error:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("dismissal Get Error:", error);
    return [];
  }
}

export async function postDismissalRequests(values: any) {
  console.log(values);
  try {
    const token = await getToken();
    const response = await fetch(`${baseURL}api/dismissal/create/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "Post",
      body: JSON.stringify(values),
    });
    // let zodLessonErrors = {}

    if (response.ok) {
      const data = await response.json();
      revalidateTag("dismissals");
      return { success: "New Dismissal request has been created", data };
    } else {
      const errorResponse = await response.json();
      let errorMessage = "Error creating a new Dismissal request"; // Default error message

      // Use the backend error message directly if it exists
      if (errorResponse.detail) {
        // Assuming the detail field is an array and you want to join messages if there are multiple
        errorMessage = Array.isArray(errorResponse.detail)
          ? errorResponse.detail.join(", ")
          : errorResponse.detail;
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

export async function updateDismissalRequestsStatus(values: any) {
  console.log(values);

  const requestID = values.id;
  const refinedData = {
    status: values.status,
  };

  try {
    const token = await getToken();
    const apiUrl = `${baseURL}api/dismissal/update_status/${requestID}/`;

    // console.log("API URL:", apiUrl);
    // console.log("Request Data:", refinedData);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PUT", // Ensure method is in uppercase
      body: JSON.stringify(refinedData),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(
        "Update status Dismissals Error:",
        response.status,
        response.statusText
      );
      return undefined;
    }
  } catch (error) {
    console.error("Update status Dismissal Error:", error);
    return undefined;
  } finally {
    revalidateTag("dismissals");
  }
}

// export async function updateDismissalRequestsStatus(values: any) {
//   console.log(values)
//   const requestID = values.id
//     const refinedData = {
//       status: values.status
//     }
//     try {
//       const token = await getToken();
//       const response = await fetch(`${baseURL}api/dismissal/update_status/${requestID}/?login_profile=${login_profile}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         method: "Patch",
//         body: JSON.stringify(refinedData)
//       });
//       // let zodLessonErrors = {}
//       if (response.ok) {
//         const data = await response.json();
//         return data
//       } else {
//         console.error("Update status Dismissals Error:", response.status, response.statusText);
//         return undefined;
//       }
//     } catch (error) {
//       console.error("Update status Dismissal Error:", error);
//       return undefined;
//     } finally {
//         revalidateTag("dismissals")
//     }
// }

export async function getDismissalStudentBySection(sectionId: any) {
  console.log(sectionId);
  try {
    const token = await getToken();
    const url = `${baseURL}api/dismissal/normal_dismissal/?login_profile=${login_profile}&section=${sectionId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } else {
      console.error(
        "Selected students for dismissal Get Error:",
        response.status,
        response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Selected students for grading Get Error:", error);
    return [];
  }
}

export async function updateDismissalRequestsProgress(
  requestID: any,
  refinedData: any
) {
  console.log("this is dismissal id", requestID);
  try {
    const token = await getToken();
    const apiUrl = `${baseURL}api/dismissal/update_progress/${requestID}/?login_profile=${login_profile}`;

    // console.log("API URL:", apiUrl);
    // console.log("Request Data:", refinedData);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(refinedData),
    });

    if (response.ok) {
      const data = await response.json();
      revalidateTag("dismissals");
      return data;
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
