import { withAuth, NextMiddlewareWithAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
export default withAuth({
  secret: process.env.NEXTAUTH_SECRET,
});

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/teacher/:path",
    "/parent/:path",
    "/academic/:path",
    "/nurse/:path",
  ],
};

// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const isAuthorized = (role: string, path: string): boolean => {
//   const rolePaths: { [key: string]: string } = {
//     SA: "/admin",
//     TE: "/teacher",
//     AC: "/academics",
//     NU: "/nurse",
//   };

//   const defaultPath = "/unauthorized";

//   return path.startsWith(rolePaths[role] || defaultPath);
// };

// export async function middleware(request: NextRequest) {
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   if (!token) return NextResponse.redirect(new URL("/login", request.url));

//   if (token.userType === "Parent") {
//     switch (token.userRole) {
//       case "PA":
//         if (!request.nextUrl.pathname.startsWith("/profile")) {
//           return NextResponse.redirect(
//             new URL("/profile/dashboard", request.url)
//           );
//         }
//         break;
//       default:
//         return NextResponse.redirect(new URL("/unauthorized", request.url));
//     }
//   } else {
//     if (token.userProfiles && token.userProfiles.length === 1) {
//       switch (token.userProfiles[0].userRole) {
//         case "PR":
//           if (!request.nextUrl.pathname.startsWith("/principal")) {
//             return NextResponse.redirect(
//               new URL("/principal/dashboard", request.url)
//             );
//           }
//           break;
//         case "AC":
//           if (!request.nextUrl.pathname.startsWith("/academics")) {
//             return NextResponse.redirect(
//               new URL("/academics/dashboard", request.url)
//             );
//           }
//           break;
//         case "SA":
//           if (!request.nextUrl.pathname.startsWith("/admin")) {
//             return NextResponse.redirect(
//               new URL("/admin/dashboard", request.url)
//             );
//           }
//           break;
//         case "TE":
//           if (!request.nextUrl.pathname.startsWith("/teacher")) {
//             return NextResponse.redirect(
//               new URL("/teacher/dashboard", request.url)
//             );
//           }
//           break;
//         case "NU":
//           if (!request.nextUrl.pathname.startsWith("/nurse")) {
//             return NextResponse.redirect(
//               new URL("/nurse/dashboard", request.url)
//             );
//           }
//           break;
//         default:
//           return NextResponse.redirect(new URL("/unauthorized", request.url));
//       }
//     } else {
//       const isAuthorizedPath = token.userProfiles?.some((profile) =>
//         isAuthorized(profile.userRole, request.nextUrl.pathname)
//       );
//       if (!isAuthorizedPath) {
//         return NextResponse.redirect(new URL("/unauthorized", request.url));
//       }
//     }
//   }
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
// };

// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const isAuthorized = (role: string, path: string): boolean => {
//   const rolePaths: { [key: string]: string } = {
//     SA: "/admin",
//     TE: "/teacher",
//     AC: "/academics",
//     NU: "/nurse",
//     // Add other roles and paths as necessary
//   };

//   const defaultPath = "/";

//   return path.startsWith(rolePaths[role] || defaultPath);
// };

// export async function middleware(request: NextRequest) {
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   if (!token) {
//     // Redirect to login if no token is present
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   const requestedPath = request.nextUrl.pathname;

//   if (token.userType === "Parent") {
//     if (token.userRole !== "PA" && !requestedPath.startsWith("/profile")) {
//       // Redirect non-PA parents to a safe page
//       if (requestedPath !== "/unauthorized") {
//         return NextResponse.redirect(new URL("/unauthorized", request.url));
//       }
//       return NextResponse.next(); // Break out of the middleware
//     }
//     return NextResponse.redirect(new URL("/profile/dashboard", request.url));
//   } else if (token.userType === "Staff") {
//     const hasAuthorizedAccess = token.userProfiles?.some((profile) =>
//       isAuthorized(profile.userRole, requestedPath)
//     );

//     if (!hasAuthorizedAccess) {
//       // Redirect unauthorized staff to a safe page
//       return NextResponse.redirect(new URL("/unauthorized", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
// };

// // Import necessary modules
// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// // Function to check if the user has access to a specific path based on role
// const isAuthorized = (role: string, path: string): boolean => {
//   const rolePaths: { [key: string]: string } = {
//     SA: "/admin",
//     TE: "/teacher",
//     AC: "/academics",
//     NU: "/nurse",
//     PA: "/parent", // Add other roles and paths as necessary
//   };

//   const defaultPath = "/";

//   return path.startsWith(rolePaths[role] || defaultPath);
// };

// // Middleware function
// export async function middleware(request: NextRequest) {
//   // Get token from the request
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   // If no token is present, redirect to login
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Get the requested path from the URL
//   const requestedPath = request.nextUrl.pathname;

//   // Check if the user is a Parent
//   if (token.userType === "Parent") {
//     // If the user is not a Parent Admin and not accessing a Parent-related path, redirect to unauthorized
//     if (token.userRole !== "PA" && !requestedPath.startsWith("/parent")) {
//       return NextResponse.redirect(new URL("/unauthorized", request.url));
//     }

//     // Allow access to Parent-related paths
//     return NextResponse.next();
//   }

//   // Check if the user is Staff
//   else if (token.userType === "Staff") {
//     // Check if the user has authorized access based on roles and paths
//     const hasAuthorizedAccess = token.userProfiles?.some((profile) =>
//       isAuthorized(profile.userRole, requestedPath)
//     );

//     // If the user does not have authorized access, redirect to unauthorized
//     if (!hasAuthorizedAccess) {
//       return NextResponse.redirect(new URL("/unauthorized", request.url));
//     }

//     // Allow access to authorized paths
//     return NextResponse.next();
//   }

//   // For other user types, redirect to unauthorized
//   return NextResponse.redirect(new URL("/unauthorized", request.url));
// }

// // Configuration for the middleware
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
// };
