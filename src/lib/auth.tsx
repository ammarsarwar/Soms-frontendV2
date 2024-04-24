import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "./axios";

export const authOptions: NextAuthOptions = {
  // providers: [
  //   CredentialsProvider({
  //     name: "Credentials",
  //     credentials: {
  //       email: {},
  //       password: {},
  //     },
  //     async authorize(credentials, req) {
  //       if (!credentials) {
  //         throw new Error("Credentials object is undefined");
  //       }
  //       const { email, password } = credentials;
  //       const user = await signInWithCredentials({
  //         email,
  //         password,
  //       });

  //       if (!user) {
  //         throw new Error("Invalid credentials");
  //       }
  //       // console.log("this is user,", user);
  //       return {
  //         ...user,
  //         id: `${user.user_id}`,
  //         name: `${user.first_name} ${user.last_name}`,
  //         first_name: user.first_name,
  //         last_name: user.last_name,
  //         date_of_birth: user.date_of_birth,
  //         access_token: user.access_token,
  //         userProfiles: user.userProfiles,
  //       };
  //       // return user;
  //     },
  //   }),
  // ],
  providers: [
    CredentialsProvider({
      id: "staff-login",
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("Credentials object is undefined");
        }
        const { email, password } = credentials;
        const user = await signInWithCredentials({
          email,
          password,
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }
        // console.log("this is user,", user);
        return {
          ...user,
          id: `${user.user_id}`,
          name: `${user.first_name} ${user.last_name}`,
          first_name: user.first_name,
          last_name: user.last_name,
          date_of_birth: user.date_of_birth,
          access_token: user.access_token,
          userProfiles: user.userProfiles,
          userType: "Staff",
        };
        // return user;
      },
    }),
    CredentialsProvider({
      id: "parent-login",
      name: "CredentialsParent",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("Credentials object is undefined");
        }
        const { email, password } = credentials;
        const user = await parentSignInWithCredentials({
          email,
          password,
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }
        console.log("this is parent user,", user);
        return {
          ...user,
          id: `${user.user_id}`,
          name_english: user.parent_name_english,
          name_arabic: user.parent_name_arabic,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_id: user.profile_id,
          access_token: user.access_token,
          userRole: "PA",
          userType: "Parent",
        };
        // return user;
      },
    }),
  ],
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       return {
  //         ...token,
  //         id: user.id,
  //         first_name: user.first_name,
  //         last_name: user.last_name,
  //         access_token: user.access_token,
  //         dateOfBirth: user.date_of_birth,
  //         userProfiles: user.userProfiles.map((profile) => {
  //           return {
  //             profile_id: profile.profile_id,
  //             userRole: profile.userRole,
  //           };
  //         }),
  //       };
  //     }
  //     return token;
  //   },
  //   async session({ session, user, token }) {
  //     if (session?.user) {
  //       session.user.id = token.id;
  //       session.user.access_token = token.access_token;
  //       session.user.first_name = token.first_name;
  //       session.user.last_name = token.last_name;
  //       session.user.userProfiles = token.userProfiles;
  //       session.user.date_of_birth = token.date_of_birth;
  //     }
  //     return session;
  //   },
  // },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userType = user.userType;
        // Add other user-specific fields based on userType
        if (user.userType === "Staff") {
          token.first_name = user.first_name;
          token.last_name = user.last_name;
          token.date_of_birth = user.date_of_birth;
          token.userProfiles = user.userProfiles;
        } else if (user.userType === "Parent") {
          token.parent_name_english = user.parent_name_english;
          token.parent_name_arabic = user.parent_name_arabic;
          token.profile_id = user.profile_id;
          token.userRole = user.userRole;
        }
        token.access_token = user.access_token;
      }
      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user = {
          ...session.user, // This spreads the existing properties of session.user
          id: token.id,
          email: token.email,
          access_token: token.access_token,
          userType: token.userType,
          // Include other user-specific fields based on userType
          ...(token.userType === "Staff" && {
            first_name: token.first_name,
            last_name: token.last_name,
            date_of_birth: token.date_of_birth,
            userProfiles: token.userProfiles,
          }),
          ...(token.userType === "Parent" && {
            parent_name_english: token.parent_name_english,
            parent_name_arabic: token.parent_name_arabic,
            profile_id: token.profile_id,
            userRole: token.userRole,
          }),
        };
      }
      // console.log(session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
    // error: "/errors",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const signInWithCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await axios.post("api/user/login/", {
    email,
    password,
  });
  const data = res.data;
  if (!res) throw new Error("Invalid credentials");

  return data;
};

const parentSignInWithCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await axios.post("api/user/parent/login/", {
    email,
    password,
  });
  const data = res.data;
  if (!res) throw new Error("Invalid credentials");

  return data;
};
