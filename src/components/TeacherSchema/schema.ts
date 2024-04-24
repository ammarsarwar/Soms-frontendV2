// import { z } from "zod";

// export const individualUserSchema = z.object({
//   id: z.number(),
//   email: z.string(),
//   first_name: z.string(),
//   last_name: z.string(),
//   date_of_birth: z.string(),
// })

// export type IndividualUser = z.infer<typeof individualUserSchema>

// export const userSchema = z.object({
//   id: z.number(),
//   user: individualUserSchema,
//   userRole: z.string(),
//   created_at: z.string(),
//   school: z.number(),
//   branch: z.number(),
//   campus: z.number(),
//   department: z.nullable(z.unknown()),
//   created_by: z.number(),
// });

// export type User = z.infer<typeof userSchema>

import { z } from "zod";

export const schoolSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  grade_system: z.string(),
  country: z.string(),
  number_of_branches: z.number(),
  school_reg_no: z.string(),
  terms_per_year: z.number(),
  status: z.string(),
  created: z.string(),
});

export type School = z.infer<typeof schoolSchema>;

export const branchSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string(),
  branch_license: z.string(),
  curriculum: z.string(),
  email_address: z.string(),
  number_of_campuses: z.number(),
  status: z.string(),
  created: z.string(),
  school: z.number(),
});

export type Branch = z.infer<typeof branchSchema>;

export const campusSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string(),
  contact_number: z.nullable(z.string()),
  email_address: z.nullable(z.string()),
  created: z.string(),
  branch: z.number(),
});

export type Campus = z.infer<typeof campusSchema>;

export const userProfileSchema = z.object({
  id: z.number(),
  school: schoolSchema,
  branch: z.nullable(branchSchema),
  campus: z.nullable(campusSchema),
  department: z.nullable(z.unknown()),
  userRole: z.string(),
  created_at: z.string(),
  created_by: z.nullable(z.number()),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export const individualUserSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  date_of_birth: z.string(),
});

export type IndividualUser = z.infer<typeof individualUserSchema>;

export const userSchema = z.object({
  id: z.number(),
  user: individualUserSchema,
  userRole: z.string(),
  created_at: z.string(),
  school: z.number(),
  branch: z.number(),
  campus: z.number(),
  department: z.nullable(z.unknown()),
  created_by: z.number(),
});

export type User = z.infer<typeof userSchema>;
