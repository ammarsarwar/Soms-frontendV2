// import { z } from "zod";

// const SchoolSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   address: z.string(),
//   grade_system: z.string(),
//   country: z.string(),
//   number_of_branches: z.number(),
//   school_reg_no: z.string(),
//   terms_per_year: z.number(),
//   status: z.string(),
//   created: z.string(),
// });

// export const branchSchema = z.object({
//   id: z.number(),
//   school: z.optional(SchoolSchema),
//   name: z.string(),
//   number_of_campuses: z.number(),
//   location: z.string(),
//   curriculum: z.string(),
//   email_address: z.string(),
//   branch_license: z.string().refine((value) => /^\d{3}-\d{4}$/.test(value), {
//     message: "Invalid branch_license format",
//   }),
//   status: z.string(),
//   created: z.string(),
// });

// export const campusSchema = z.object({
//   id: z.number(),
//   branch: z.optional(branchSchema),
//   name: z.string(),
//   contact_number: z.optional(z.number().int()),
//   email_address: z.optional(z.string()),
//   location: z.string(),
//   status: z.string(),
//   created: z.string(),
// });

// export const admissionSchema = z.object({
//   id: z.number(),
//   campus: z.optional(campusSchema),
//   name: z.string(),
//   application_status: z.string(),
//   appointment_time: z.string(),
//   created: z.string(),
// });

// export type Admission = z.infer<typeof admissionSchema>;

import { z } from "zod";

const AcademicYearSchema = z.object({
  id: z.number(),
  start_year: z.number(),
  end_year: z.number(),
  status: z.string(),
  created: z.string(),
  school: z.number(),
});

const DepartmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  campus: z.object({
    id: z.number(),
    name: z.string(),
    branch: z.object({
      id: z.number(),
      name: z.string(),
      school: z.object({
        id: z.number(),
        name: z.string(),
      }),
    }),
  }),
});

const GradeSchema = z.object({
  id: z.number(),
  academic_year: AcademicYearSchema,
  department: DepartmentSchema,
  name: z.string(),
  level_number: z.number().optional(),
  grading_criteria: z.string().optional(),
  number_of_sections: z.number(),
  created: z.string(),
});

const SchoolSchema = z.object({
  id: z.number(),
  name: z.string(),
  // Additional fields can be added here as needed
});

const BranchSchema = z.object({
  id: z.number(),
  school: SchoolSchema,
  name: z.string(),
  location: z.string(),
  branch_license: z.string(),
  curriculum: z.string(),
  email_address: z.string().optional(),
  number_of_campuses: z.number(),
  status: z.string(),
  created: z.string(),
});

const ScheduledTestSchema = z.object({
  id: z.number(),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  max_students: z.number(),
  available: z.boolean(),
  admission_calendar: z.number(),
  teacher: z.number(),
  department: z.number(),
});

const AdmissionSchema = z.object({
  id: z.number(),
  applied_grade: GradeSchema,
  applied_branch: BranchSchema,
  assigned_section: z.number().optional(),
  scheduled_test: ScheduledTestSchema,
  parent_name_arabic: z.string(),
  parent_name_english: z.string(),
  parent_email: z.string(),
  parent_phone_number: z.string(),
  emergency_phone_number: z.string(),
  relation_to_child: z.string(),
  student_national_id: z.string(),
  student_first_name_english: z.string(),
  student_middle_name_english: z.string(),
  student_last_name_english: z.string(),
  student_first_name_arabic: z.string(),
  student_middle_name_arabic: z.string(),
  student_last_name_arabic: z.string(),
  student_gender: z.string(),
  student_date_of_birth: z.string(),
  status: z.string(),
  updated_at: z.string(),
  created_at: z.string(),
  admission_calendar: z.number(),
  parent: z.number().optional(),
});

export type Admission = z.infer<typeof AdmissionSchema>;
