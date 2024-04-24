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

  level: z.string(),
  created: z.string(),
});
export const gradeSchema = z.object({
  id: z.number(),
  name: z.string(),
  department: z.optional(deptSchema),
  created: z.string(),
});

export type Grade = z.infer<typeof gradeSchema>;
// {
//     "count": 5,
//     "next": null,
//     "previous": null,
//     "results": [
//         {
//             "id": 1,
//             "school": {
//                 "id": 1,
//                 "name": "Sample School 1",
//                 "address": "Sample Address",
//                 "grade_system": "Letter",
//                 "country": "Pakistan",
//                 "number_of_branches": 3,
//                 "school_reg_no": "12382",
//                 "terms_per_year": 2,
//                 "status": "active",
//                 "created": "2023-12-08"
//             },
//             "name": "Sample Branch 1",
//             "location": "Sample Location",
//             "curriculum": "Sample",
//             "contact_number": "123443",
//             "email_address": "sa@gmail.com",
//             "number_of_campuses": 2,
//             "status": "active",
//             "created": "2023-12-08"
//         },
//         {
//             "id": 2,
//             "school": {
//                 "id": 1,
//                 "name": "Sample School 1",
//                 "address": "Sample Address",
//                 "grade_system": "Letter",
//                 "country": "Pakistan",
//                 "number_of_branches": 3,
//                 "school_reg_no": "12382",
//                 "terms_per_year": 2,
//                 "status": "active",
//                 "created": "2023-12-08"
//             },
//             "name": "Branch 3",
//             "location": "Location 1",
//             "curriculum": "Curriculum 1",
//             "contact_number": "1234567890",
//             "email_address": "branch13@example.com",
//             "number_of_campuses": 1,
//             "status": "active",
//             "created": "2023-12-14"
//         },
//         {
//             "id": 3,
//             "school": {
//                 "id": 1,
//                 "name": "Sample School 1",
//                 "address": "Sample Address",
//                 "grade_system": "Letter",
//                 "country": "Pakistan",
//                 "number_of_branches": 3,
//                 "school_reg_no": "12382",
//                 "terms_per_year": 2,
//                 "status": "active",
//                 "created": "2023-12-08"
//             },
//             "name": "Branch ammar",
//             "location": "Location 234",
//             "curriculum": "Curriculum 1",
//             "contact_number": "1234567890",
//             "email_address": "branch1543@example.com",
//             "number_of_campuses": 1,
//             "status": "active",
//             "created": "2023-12-15"
//         },
//         {
//             "id": 4,
//             "school": {
//                 "id": 1,
//                 "name": "Sample School 1",
//                 "address": "Sample Address",
//                 "grade_system": "Letter",
//                 "country": "Pakistan",
//                 "number_of_branches": 3,
//                 "school_reg_no": "12382",
//                 "terms_per_year": 2,
//                 "status": "active",
//                 "created": "2023-12-08"
//             },
//             "name": "as",
//             "location": "jeddah",
//             "curriculum": "British",
//             "contact_number": "12345",
//             "email_address": "ammarsarwar99@gmail.com",
//             "number_of_campuses": 1,
//             "status": "active",
//             "created": "2023-12-15"
//         },
//         {
//             "id": 5,
//             "school": {
//                 "id": 1,
//                 "name": "Sample School 1",
//                 "address": "Sample Address",
//                 "grade_system": "Letter",
//                 "country": "Pakistan",
//                 "number_of_branches": 3,
//                 "school_reg_no": "12382",
//                 "terms_per_year": 2,
//                 "status": "active",
//                 "created": "2023-12-08"
//             },
//             "name": "as",
//             "location": "jeddah",
//             "curriculum": "British",
//             "contact_number": "12345",
//             "email_address": "ammarsarwar99@gmail.com",
//             "number_of_campuses": 1,
//             "status": "active",
//             "created": "2023-12-15"
//         }
//     ]
// }
