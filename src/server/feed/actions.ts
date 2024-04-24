'use server'

import { getCurrentUser } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// const session = get

const baseURL = process.env.BACKEND_URL;

//login profile
const loginProfile = "SA";

async function getToken() {
    const user = await getCurrentUser();
    if (user && user?.access_token) {
      return user?.access_token;
    }
    throw new Error("No session token available");
  }
  
  export async function getPosts() {
    try {
      const token = await getToken();
      const response = await fetch(`${baseURL}api/feed/post/?login_profile=${loginProfile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        next: {
          tags: ["posts"],
        },
      });
      const data = await response.json();
      // console.log(data)
      if (response.ok) {
        // const validatedData = z.array(AcademicYearSchema).safeParse(data.results)
        // if(!validatedData.success){
        //   console.error("Get Academic Year error: data on the based is changed or inconsistent please check your data and the schema",validatedData.error)
        //   return []
        // }
        return Array.isArray(data?.results) ? data.results : [];
      } else {
        console.error(`Get posts error: Error fecting years with status code  ${response.status}, Cause of error is ${response.statusText}`);
        return []; 
      }
    } catch (error) {
      console.error("Get posts error:", error);
      return []; 
    }
  }


  // export async function createPosts(values: any) {
  //   console.log(values)
  //   try {
  //     const token = await getToken();
  //     const userData = await getServerSession(authOptions);
  //     const refinedData = {
  //       text: values.text,
  //       posted_by: Number(userData?.user.id),
  //     }
  //     const myheaders = new Headers();
  //     myheaders.append("Authorization", `Bearer ${token}`)
  //     // myheaders.append("Content-Type", "multipart/form-data");
  //     const formData = new FormData();
  //     formData.append("text", values.text)
  //     formData.append("posted_by", String(userData?.user.id))
  //     console.log(formData)
  //     const response = await fetch(`${baseURL}api/feed/post/create/?login_profile=${loginProfile}`, {
  //       headers: myheaders,
  //       method: "POST",
  //      body: formData
  //     });
  //     const data = await response.json();
  //     console.log(data)
  //     if (response.ok) {
  //       // const validatedData = z.array(AcademicYearSchema).safeParse(data.results)
  //       // if(!validatedData.success){
  //       //   console.error("Get Academic Year error: data on the based is changed or inconsistent please check your data and the schema",validatedData.error)
  //       //   return []
  //       // }
  //       return data;
  //     } else {
  //       console.error(`Create posts error: Error creating posts with status code  ${response.status}, Cause of error is ${response.statusText}`);
  //       return undefined; 
  //     }
  //   } catch (error) {
  //     console.error("Create posts error:", error);
  //     return undefined; 
    // } finally {
    //   revalidateTag("posts")
    // }
  // }

export async function createPosts(formData: FormData) {
  console.log("This is form data",formData)
  try {
    const token = await getToken();

    // Set up the request headers.
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
      
    });

    // Perform the fetch request to the server endpoint.
    const response = await fetch(
      `${baseURL}api/feed/post/create/`, 
      {
        method: "POST",
        headers: headers,
        body: formData, // Directly use the FormData passed as an argument
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(`Response is not okay, Create posts error: ${response.statusText}`);
      return undefined;
    }

    return data;
  } catch (error) {
    console.error("Create posts error:", error);
    return undefined;
  } finally {
    revalidateTag("posts");
  }
}



//   interface PostRequestBody {
//     text: string;
//     posted_by: string | undefined;
//     videos?: { video_link: string }[];
//     documents?: { document_link: string }[];
//     images?: { image_link: File }[];
//   }
  
  
//   export async function createPosts(formData: any) {
//     try {
//       const token = await getToken();
//       const userData = await getServerSession(authOptions);
  
//        // Initialize the request body with required fields
//        const requestBody: PostRequestBody = {
//         text: formData.get('text'),
//         posted_by: userData?.user.id,
//       };

//     // Assuming videoLink and documentLink are URLs (strings)
// const videos = formData.getAll('videos') as string[];
// const documents = formData.getAll('documents') as string[];

// // If imageLink is a File object
// const images = formData.getAll('images') as File[];

//     if (videos.length > 0) {
//       requestBody.videos = videos.map(videoLink => ({ video_link: videoLink }));
//     }

//     if (documents.length > 0) {
//       requestBody.documents = documents.map(documentLink => ({ document_link: documentLink }));
//     }

//     if (images.length > 0) {
//       // If images are file objects, you need to handle file upload here.
//       // This example assumes images are URLs for simplicity.
//       requestBody.images = images.map(imageLink => ({ image_link: imageLink }));
//     }
  
//       const myheaders = new Headers();
//       myheaders.append("Authorization", `Bearer ${token}`);
//       myheaders.append("Content-Type", "application/json");
  
//       const response = await fetch(`${baseURL}api/feed/post/create/?login_profile=${loginProfile}`, {
//         method: "POST",
//         headers: myheaders,
//         body: JSON.stringify(requestBody),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         return data;
//       } else {
//         console.error(`Create posts error: Error creating posts with status code ${response.status}, Cause of error is ${response.statusText}`);
//         return undefined;
//       }
//     } catch (error) {
//       console.error("Create posts error:", error);
//       return undefined;
//     } finally {
//       revalidateTag("posts");
//     }
//   }
  
  

  export async function createReacts(reactionType:string, postId:number) {
    try {
      const token = await getToken();
      const userData = await getServerSession(authOptions);
      const refinedData = {
        post: postId,
        reaction_type: reactionType,
        reacted_by: Number(userData?.user.id),
      }
      console.log(refinedData)
      const response = await fetch(
        `${baseURL}api/feed/post/add_reaction/`,
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
        return data;
      } else {
        console.error("Error reacting to the post:", response.status, response.statusText);
        return undefined
      }
    } catch (error) {
      console.error("Error reacting to the post:", error);
      return undefined
    } finally {
      revalidateTag("posts")
    }
  }