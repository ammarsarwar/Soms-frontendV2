import { z } from "zod";

const SchoolSchema = z.object({
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

export const branchSchema = z.object({
  id: z.number(),
  school: z.optional(SchoolSchema),
  name: z.string(),
  number_of_campuses: z.number(),
  location: z.string(),
  curriculum: z.string(),
  email_address: z.string(),
  branch_license: z.string().refine((value) => /^\d{3}-\d{4}$/.test(value), {
    message: "Invalid branch_license format",
  }),
  status: z.string(),
  created: z.string(),
});

export const campusSchema = z.object({
  id: z.number(),
  branch: z.optional(branchSchema),
  name: z.string(),
  contact_number: z.optional(z.number().int()),
  email_address: z.optional(z.string()),
  location: z.string(),
  status: z.string(),
  created: z.string(),
});

export const deptSchema = z.object({
  id: z.number(),
  name: z.string(),
  campus: z.optional(campusSchema),
  status: z.string(),
  level: z.string(),
  created: z.string(),
});

export type Department = z.infer<typeof deptSchema>;
