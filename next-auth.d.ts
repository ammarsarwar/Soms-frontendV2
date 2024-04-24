// import { DefaultSession, DefaultUser } from "next-auth"
// import { JWT, DefaultJWT } from "next-auth/jwt"


// interface UserProfileDetails {
//     profile_id: number;
//     userRole: string;
//   }

//   declare module "next-auth" {
//     interface Session {
//         user: {
//             id: string,
//             first_name: string;
//             email: string,
//             last_name: string;
//             user_id?: number;
//             access_token: string,
//             date_of_birth: string,
//             userProfiles: UserProfileDetails[]
//         } & DefaultSession
//     }

//     interface User extends DefaultUser {
//         id: string,
//         first_name: string;
//         last_name: string;
//         user_id?: number;
//         access_token: string,
//         date_of_birth: string,
//         userProfiles: UserProfileDetails[]
//     }
// }


// declare module "next-auth/jwt" {
//     interface JWT extends DefaultJWT {
//         id: string,
//         first_name: string;
//         last_name: string;
//         user_id?: number;
//         access_token: string,
//         date_of_birth: string,
//         userProfiles: UserProfileDetails[]
//     }
// }

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

interface UserProfileDetails {
  profile_id: number;
  userRole: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      access_token: string;
      userType: string;
      first_name?: string;
      last_name?: string;
      date_of_birth?: string;
      userProfiles?: UserProfileDetails[];
      parent_name_english?: string;
      parent_name_arabic?: string;
      profile_id?: number;
      userRole?: string
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    access_token: string;
    userType: string;
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    userProfiles?: UserProfileDetails[];
    parent_name_english?: string;
    parent_name_arabic?: string;
    profile_id?: number;
    userRole?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    access_token: string;
    userType: string;
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    userProfiles?: UserProfileDetails[];
    parent_name_english?: string;
    parent_name_arabic?: string;
    profile_id?: number;
    userRole?: string
  }
}
